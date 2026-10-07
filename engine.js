class MiniSQL {
  constructor() {
    this.reset();
  }

  reset() {
    this.databases = {};
    this.activeDb = null;
    this.audit = { insertedTrial: false, deletedTrial: false };
  }

  snapshot() {
    return JSON.parse(JSON.stringify({
      databases: this.databases,
      activeDb: this.activeDb,
      audit: this.audit
    }));
  }

  restore(data) {
    if (!data || !data.databases) return;
    this.databases = data.databases;
    this.activeDb = data.activeDb || null;
    this.audit = data.audit || { insertedTrial: false, deletedTrial: false };
  }

  normalizeIdent(s) {
    return String(s || '').trim().replace(/^`|`$/g, '');
  }

  current() {
    if (!this.activeDb || !this.databases[this.activeDb]) {
      throw this.err(1046, '3D000', 'No database selected');
    }
    return this.databases[this.activeDb];
  }

  err(code, state, msg) {
    const e = new Error(msg);
    e.sqlCode = code;
    e.sqlState = state;
    return e;
  }

  execute(sql) {
    const started = performance.now ? performance.now() : Date.now();
    let q = String(sql || '').trim();
    if (!q) return { type: 'message', message: '' };
    q = q.replace(/;\s*$/, '').trim();
    const upper = q.toUpperCase();
    let result;

    try {
      if (/^CREATE\s+DATABASE\b/i.test(q)) result = this.createDatabase(q);
      else if (/^USE\b/i.test(q)) result = this.useDatabase(q);
      else if (/^SHOW\s+DATABASES\b/i.test(q)) result = this.showDatabases();
      else if (/^SHOW\s+TABLES\b/i.test(q)) result = this.showTables();
      else if (/^(DESC|DESCRIBE)\b/i.test(q)) result = this.describe(q);
      else if (/^CREATE\s+TABLE\b/i.test(q)) result = this.createTable(q);
      else if (/^ALTER\s+TABLE\b/i.test(q)) result = this.alterTable(q);
      else if (/^INSERT\s+INTO\b/i.test(q)) result = this.insert(q);
      else if (/^UPDATE\b/i.test(q)) result = this.update(q);
      else if (/^DELETE\s+FROM\b/i.test(q)) result = this.delete(q);
      else if (/^SELECT\b/i.test(q)) result = this.select(q);
      else if (/^(CLEAR|CLS)$/i.test(q)) result = { type: 'clear' };
      else if (/^(HELP|HELP\s+SQL)$/i.test(q)) result = { type: 'message', message: 'Perintah didukung: CREATE DATABASE, USE, SHOW DATABASES, SHOW TABLES, DESC, CREATE TABLE, ALTER TABLE, INSERT, UPDATE, DELETE, SELECT, JOIN, WHERE, LIKE, COUNT, GROUP BY, ORDER BY.' };
      else throw this.err(1064, '42000', `You have an error in your SQL syntax near '${q.slice(0, 36)}'`);
    } catch (e) {
      if (e.sqlCode) throw e;
      throw this.err(1064, '42000', e.message || 'SQL syntax error');
    }

    const ended = performance.now ? performance.now() : Date.now();
    result.elapsed = Math.max(0.001, (ended - started) / 1000);
    return result;
  }

  createDatabase(q) {
    const m = q.match(/^CREATE\s+DATABASE\s+(?:IF\s+NOT\s+EXISTS\s+)?([`\w]+)$/i);
    if (!m) throw this.err(1064, '42000', 'Invalid CREATE DATABASE syntax');
    const name = this.normalizeIdent(m[1]);
    if (this.databases[name]) throw this.err(1007, 'HY000', `Can't create database '${name}'; database exists`);
    this.databases[name] = { tables: {} };
    return { type: 'ok', affected: 1, message: 'Query OK, 1 row affected' };
  }

  useDatabase(q) {
    const m = q.match(/^USE\s+([`\w]+)$/i);
    if (!m) throw this.err(1064, '42000', 'Invalid USE syntax');
    const name = this.normalizeIdent(m[1]);
    if (!this.databases[name]) throw this.err(1049, '42000', `Unknown database '${name}'`);
    this.activeDb = name;
    return { type: 'message', message: 'Database changed' };
  }

  showDatabases() {
    return { type: 'table', columns: ['Database'], rows: Object.keys(this.databases).map(x => [x]) };
  }

  showTables() {
    const db = this.current();
    const col = `Tables_in_${this.activeDb}`;
    return { type: 'table', columns: [col], rows: Object.keys(db.tables).map(x => [x]) };
  }

  describe(q) {
    const m = q.match(/^(?:DESC|DESCRIBE)\s+([`\w]+)$/i);
    if (!m) throw this.err(1064, '42000', 'Invalid DESCRIBE syntax');
    const table = this.getTable(this.normalizeIdent(m[1]));
    const rows = Object.values(table.schema.columns).map(c => [
      c.name,
      c.type,
      c.nullable ? 'YES' : 'NO',
      c.primary ? 'PRI' : c.unique ? 'UNI' : '',
      c.default == null ? 'NULL' : c.default,
      c.autoIncrement ? 'auto_increment' : ''
    ]);
    return { type: 'table', columns: ['Field', 'Type', 'Null', 'Key', 'Default', 'Extra'], rows };
  }

  splitTopLevel(s, delimiter = ',') {
    const out = [];
    let buf = '', depth = 0, quote = null;
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      if (quote) {
        buf += ch;
        if (ch === quote && s[i - 1] !== '\\') quote = null;
        continue;
      }
      if (ch === "'" || ch === '"') { quote = ch; buf += ch; continue; }
      if (ch === '(') depth++;
      if (ch === ')') depth--;
      if (ch === delimiter && depth === 0) { out.push(buf.trim()); buf = ''; }
      else buf += ch;
    }
    if (buf.trim()) out.push(buf.trim());
    return out;
  }


  splitStatements(sqlText) {
    const text = String(sqlText || '');
    const out = [];
    let buf = '', quote = null, backtick = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const prev = text[i - 1];
      if (quote) {
        buf += ch;
        if (ch === quote && prev !== '\\') quote = null;
        continue;
      }
      if (backtick) {
        buf += ch;
        if (ch === '`') backtick = false;
        continue;
      }
      if (ch === "'" || ch === '"') { quote = ch; buf += ch; continue; }
      if (ch === '`') { backtick = true; buf += ch; continue; }
      if (ch === ';') {
        if (buf.trim()) out.push(buf.trim());
        buf = '';
        continue;
      }
      buf += ch;
    }
    if (buf.trim()) out.push(buf.trim());
    return out;
  }

  coerceValue(info, value, columnName) {
    if (value == null) return null;
    const type = String(info.type || '').toUpperCase().replace(/\s+/g, '');
    let m;
    if ((m = type.match(/^VARCHAR\((\d+)\)$/))) {
      const max = Number(m[1]);
      const str = String(value);
      if (str.length > max) throw this.err(1406, '22001', `Data too long for column '${columnName}' at row 1`);
      return str;
    }
    if (/^INT(?:\(\d+\))?$/.test(type)) {
      const raw = String(value).trim();
      if (!/^[+-]?\d+$/.test(raw)) throw this.err(1366, 'HY000', `Incorrect integer value: '${value}' for column '${columnName}'`);
      const num = Number(raw);
      if (!Number.isInteger(num) || num < -2147483648 || num > 2147483647) throw this.err(1264, '22003', `Out of range value for column '${columnName}'`);
      return num;
    }
    if (type === 'DATE') {
      const str = String(value);
      const dm = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (!dm) throw this.err(1292, '22007', `Incorrect date value: '${value}' for column '${columnName}'`);
      const y=Number(dm[1]), mo=Number(dm[2]), d=Number(dm[3]);
      const dt = new Date(Date.UTC(y, mo-1, d));
      if (dt.getUTCFullYear()!==y || dt.getUTCMonth()!==mo-1 || dt.getUTCDate()!==d) throw this.err(1292, '22007', `Incorrect date value: '${value}' for column '${columnName}'`);
      return str;
    }
    if ((m = type.match(/^DECIMAL\((\d+),(\d+)\)$/))) {
      const precision=Number(m[1]), scale=Number(m[2]);
      const raw=String(value).trim();
      if (!/^[+-]?\d+(?:\.\d+)?$/.test(raw)) throw this.err(1366, 'HY000', `Incorrect decimal value: '${value}' for column '${columnName}'`);
      const unsigned=raw.replace(/^[+-]/,'');
      const [whole, frac='']=unsigned.split('.');
      if (frac.length>scale || whole.replace(/^0+/,'').length > precision-scale) throw this.err(1264, '22003', `Out of range value for column '${columnName}'`);
      return Number(raw);
    }
    if (type === 'YEAR') {
      const raw=String(value).trim();
      if (!/^\d{4}$/.test(raw)) throw this.err(1292, '22007', `Incorrect year value: '${value}' for column '${columnName}'`);
      const year=Number(raw);
      if (year<1901 || year>2155) throw this.err(1264, '22003', `Out of range value for column '${columnName}'`);
      return year;
    }
    return value;
  }

  createTable(q) {
    this.current();
    const m = q.match(/^CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([`\w]+)\s*\(([\s\S]+)\)$/i);
    if (!m) throw this.err(1064, '42000', 'Invalid CREATE TABLE syntax');
    const name = this.normalizeIdent(m[1]);
    const db = this.current();
    if (db.tables[name]) throw this.err(1050, '42S01', `Table '${name}' already exists`);

    const parts = this.splitTopLevel(m[2]);
    const schema = { columns: {}, order: [], foreignKeys: [] };
    const tablePrimary = [];
    const tableUnique = [];

    for (const partRaw of parts) {
      const part = partRaw.trim();
      let mm;
      if ((mm = part.match(/^(?:CONSTRAINT\s+[`\w]+\s+)?PRIMARY\s+KEY\s*\(([^)]+)\)$/i))) {
        tablePrimary.push(...mm[1].split(',').map(x => this.normalizeIdent(x)));
        continue;
      }
      if ((mm = part.match(/^(?:CONSTRAINT\s+[`\w]+\s+)?UNIQUE(?:\s+KEY)?(?:\s+[`\w]+)?\s*\(([^)]+)\)$/i))) {
        tableUnique.push(...mm[1].split(',').map(x => this.normalizeIdent(x)));
        continue;
      }
      if ((mm = part.match(/^(?:CONSTRAINT\s+[`\w]+\s+)?FOREIGN\s+KEY\s*\(([^)]+)\)\s+REFERENCES\s+([`\w]+)\s*\(([^)]+)\)/i))) {
        schema.foreignKeys.push({
          column: this.normalizeIdent(mm[1]),
          refTable: this.normalizeIdent(mm[2]),
          refColumn: this.normalizeIdent(mm[3])
        });
        continue;
      }

      const cm = part.match(/^([`\w]+)\s+([A-Z]+(?:\s*\([^)]*\))?)([\s\S]*)$/i);
      if (!cm) throw this.err(1064, '42000', `Invalid column definition near '${part.slice(0, 30)}'`);
      const colName = this.normalizeIdent(cm[1]);
      const type = cm[2].replace(/\s+/g, '').toUpperCase();
      const rest = cm[3] || '';
      schema.columns[colName] = {
        name: colName,
        type,
        primary: /\bPRIMARY\s+KEY\b/i.test(rest),
        unique: /\bUNIQUE\b/i.test(rest),
        autoIncrement: /\bAUTO_INCREMENT\b/i.test(rest),
        nullable: !/\bNOT\s+NULL\b/i.test(rest) && !/\bPRIMARY\s+KEY\b/i.test(rest),
        default: null
      };
      schema.order.push(colName);
      const ref = rest.match(/\bREFERENCES\s+([`\w]+)\s*\(([^)]+)\)/i);
      if (ref) schema.foreignKeys.push({ column: colName, refTable: this.normalizeIdent(ref[1]), refColumn: this.normalizeIdent(ref[2]) });
    }

    for (const c of tablePrimary) if (schema.columns[c]) { schema.columns[c].primary = true; schema.columns[c].nullable = false; }
    for (const c of tableUnique) if (schema.columns[c]) schema.columns[c].unique = true;
    for (const c of schema.order) if (schema.columns[c].primary) schema.columns[c].nullable = false;

    for (const fk of schema.foreignKeys) {
      if (!schema.columns[fk.column]) throw this.err(1072, '42000', `Key column '${fk.column}' doesn't exist in table`);
      const refTable = db.tables[fk.refTable];
      if (!refTable) throw this.err(1824, 'HY000', `Failed to open the referenced table '${fk.refTable}'`);
      if (!refTable.schema.columns[fk.refColumn]) throw this.err(3734, 'HY000', `Failed to add the foreign key constraint. Missing column '${fk.refColumn}' in '${fk.refTable}'`);
    }

    db.tables[name] = { schema, rows: [], autoCounters: {} };
    for (const c of schema.order) if (schema.columns[c].autoIncrement) db.tables[name].autoCounters[c] = 1;
    return { type: 'ok', affected: 0, message: 'Query OK, 0 rows affected' };
  }

  alterTable(q) {
    const m = q.match(/^ALTER\s+TABLE\s+([`\w]+)\s+([\s\S]+)$/i);
    if (!m) throw this.err(1064, '42000', 'Invalid ALTER TABLE syntax');
    const table = this.getTable(this.normalizeIdent(m[1]));
    let rest = m[2].trim();
    const actions = this.splitTopLevel(rest);
    let changed = 0;
    for (let action of actions) {
      action = action.replace(/^ADD\s+(?:COLUMN\s+)?/i, '').trim();
      const cm = action.match(/^([`\w]+)\s+([A-Z]+(?:\s*\([^)]*\))?)([\s\S]*)$/i);
      if (!cm) throw this.err(1064, '42000', `Invalid ALTER TABLE action near '${action}'`);
      const col = this.normalizeIdent(cm[1]);
      if (table.schema.columns[col]) throw this.err(1060, '42S21', `Duplicate column name '${col}'`);
      const info = {
        name: col,
        type: cm[2].replace(/\s+/g, '').toUpperCase(),
        primary: /\bPRIMARY\s+KEY\b/i.test(cm[3]),
        unique: /\bUNIQUE\b/i.test(cm[3]),
        autoIncrement: /\bAUTO_INCREMENT\b/i.test(cm[3]),
        nullable: !/\bNOT\s+NULL\b/i.test(cm[3]) && !/\bPRIMARY\s+KEY\b/i.test(cm[3]),
        default: null
      };
      table.schema.columns[col] = info;
      table.schema.order.push(col);
      table.rows.forEach(r => r[col] = null);
      if (info.autoIncrement) table.autoCounters[col] = 1;
      changed++;
    }
    return { type: 'ok', affected: 0, message: `Query OK, 0 rows affected` };
  }

  getTable(name) {
    const db = this.current();
    if (!db.tables[name]) throw this.err(1146, '42S02', `Table '${this.activeDb}.${name}' doesn't exist`);
    return db.tables[name];
  }

  parseValue(token) {
    const t = String(token).trim();
    if (/^NULL$/i.test(t)) return null;
    if (/^'.*'$/.test(t) || /^".*"$/.test(t)) return t.slice(1, -1).replace(/\\'/g, "'").replace(/\\"/g, '"');
    if (/^-?\d+$/.test(t)) {
      const digits = t.replace(/^-/, '');
      return digits.length > 15 ? t : Number(t);
    }
    if (/^-?\d+\.\d+$/.test(t)) return Number(t);
    return t;
  }

  splitValueRows(s) {
    const rows = [];
    let depth = 0, quote = null, start = -1;
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      if (quote) {
        if (ch === quote && s[i - 1] !== '\\') quote = null;
        continue;
      }
      if (ch === "'" || ch === '"') { quote = ch; continue; }
      if (ch === '(') { if (depth === 0) start = i + 1; depth++; }
      else if (ch === ')') { depth--; if (depth === 0 && start >= 0) { rows.push(s.slice(start, i)); start = -1; } }
    }
    return rows;
  }

  insert(q) {
    const m = q.match(/^INSERT\s+INTO\s+([`\w]+)\s*(?:\(([^)]*)\))?\s+VALUES\s+([\s\S]+)$/i);
    if (!m) throw this.err(1064, '42000', 'Invalid INSERT syntax');
    const name = this.normalizeIdent(m[1]);
    let table = this.getTable(name);
    const columns = m[2] ? m[2].split(',').map(x => this.normalizeIdent(x)) : table.schema.order.slice();
    for (const c of columns) if (!table.schema.columns[c]) throw this.err(1054, '42S22', `Unknown column '${c}' in 'field list'`);
    const groups = this.splitValueRows(m[3]);
    if (!groups.length) throw this.err(1064, '42000', 'VALUES list is invalid');

    const backup = JSON.parse(JSON.stringify(table));
    const auditBackup = JSON.parse(JSON.stringify(this.audit));
    let count = 0;
    try {
      for (const group of groups) {
        const vals = this.splitTopLevel(group).map(v => this.parseValue(v));
        if (vals.length !== columns.length) throw this.err(1136, '21S01', `Column count doesn't match value count at row ${count + 1}`);
        const row = {};
        for (const c of table.schema.order) row[c] = null;
        columns.forEach((c, i) => row[c] = vals[i]);

        for (const c of table.schema.order) {
          const info = table.schema.columns[c];
          if (info.autoIncrement && (row[c] == null || row[c] === '')) {
            row[c] = table.autoCounters[c] || 1;
          }
          row[c] = this.coerceValue(info, row[c], c);
          if (info.autoIncrement && Number(row[c]) >= (table.autoCounters[c] || 1)) {
            table.autoCounters[c] = Number(row[c]) + 1;
          }
        }
        this.validateRow(name, table, row, null);
        table.rows.push(row);
        if (name === 'penduduk' && String(row.nik) === '9999999999999999') this.audit.insertedTrial = true;
        count++;
      }
    } catch (e) {
      this.current().tables[name] = backup;
      this.audit = auditBackup;
      throw e;
    }
    return { type: 'ok', affected: count, message: `Query OK, ${count} row${count === 1 ? '' : 's'} affected` };
  }

  validateRow(tableName, table, row, existingIndex) {
    for (const c of table.schema.order) {
      const info = table.schema.columns[c];
      if (!info.nullable && (row[c] == null || row[c] === '')) {
        throw this.err(1048, '23000', `Column '${c}' cannot be null`);
      }
      if (row[c] != null) row[c] = this.coerceValue(info, row[c], c);
      if ((info.primary || info.unique) && row[c] != null) {
        const duplicate = table.rows.some((r, idx) => idx !== existingIndex && String(r[c]) === String(row[c]));
        if (duplicate) throw this.err(1062, '23000', `Duplicate entry '${row[c]}' for key '${c}'`);
      }
    }
    for (const fk of table.schema.foreignKeys) {
      if (row[fk.column] == null) continue;
      const ref = this.getTable(fk.refTable);
      if (!ref.rows.some(r => String(r[fk.refColumn]) === String(row[fk.column]))) {
        throw this.err(1452, '23000', `Cannot add or update a child row: a foreign key constraint fails (${tableName}.${fk.column})`);
      }
    }
  }

  parseWhere(where, row) {
    if (!where) return true;
    let w = where.trim();
    const andParts = w.split(/\s+AND\s+/i);
    return andParts.every(part => {
      part = part.trim();
      let m;
      if ((m = part.match(/^([`\w.]+)\s+LIKE\s+(.+)$/i))) {
        const key = this.normalizeIdent(m[1]);
        const val = String(this.parseValue(m[2]));
        const re = new RegExp('^' + val.split('%').map(x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*').split('_').join('.') + '$', 'i');
        return re.test(String(this.resolveField(row, key) ?? ''));
      }
      if ((m = part.match(/^([`\w.]+)\s*(=|<>|!=|>=|<=|>|<)\s*(.+)$/i))) {
        const left = this.resolveField(row, this.normalizeIdent(m[1]));
        const right = this.parseValue(m[3]);
        switch (m[2]) {
          case '=': return String(left) === String(right);
          case '<>': case '!=': return String(left) !== String(right);
          case '>': return left > right;
          case '<': return left < right;
          case '>=': return left >= right;
          case '<=': return left <= right;
        }
      }
      throw this.err(1064, '42000', `Unsupported WHERE condition near '${part}'`);
    });
  }

  update(q) {
    if (!/\bWHERE\b/i.test(q)) throw this.err(1175, 'HY000', 'Safe update mode: UPDATE without WHERE is blocked in this learning terminal');
    const m = q.match(/^UPDATE\s+([`\w]+)\s+SET\s+([\s\S]+?)\s+WHERE\s+([\s\S]+)$/i);
    if (!m) throw this.err(1064, '42000', 'Invalid UPDATE syntax');
    const name = this.normalizeIdent(m[1]);
    const table = this.getTable(name);
    const assigns = this.splitTopLevel(m[2]).map(x => {
      const a = x.match(/^([`\w]+)\s*=\s*(.+)$/i);
      if (!a) throw this.err(1064, '42000', `Invalid SET expression near '${x}'`);
      const col = this.normalizeIdent(a[1]);
      if (!table.schema.columns[col]) throw this.err(1054, '42S22', `Unknown column '${col}' in 'field list'`);
      return [col, this.parseValue(a[2])];
    });

    const originalRows = table.rows;
    const workingRows = JSON.parse(JSON.stringify(originalRows));
    let n = 0;
    try {
      for (let idx=0; idx<workingRows.length; idx++) {
        const row = workingRows[idx];
        const wrapped = this.wrapRow(name, originalRows[idx]);
        if (this.parseWhere(m[3], wrapped)) {
          assigns.forEach(([c, v]) => row[c] = this.coerceValue(table.schema.columns[c], v, c));
          const saved = table.rows;
          table.rows = workingRows;
          this.validateRow(name, table, row, idx);
          table.rows = saved;
          n++;
        }
      }
    } catch (e) {
      table.rows = originalRows;
      throw e;
    }
    table.rows = workingRows;
    return { type: 'ok', affected: n, message: `Query OK, ${n} row${n === 1 ? '' : 's'} affected` };
  }

  delete(q) {
    if (!/\bWHERE\b/i.test(q)) throw this.err(1175, 'HY000', 'Safe delete mode: DELETE without WHERE is blocked in this learning terminal');
    const m = q.match(/^DELETE\s+FROM\s+([`\w]+)\s+WHERE\s+([\s\S]+)$/i);
    if (!m) throw this.err(1064, '42000', 'Invalid DELETE syntax');
    const name = this.normalizeIdent(m[1]);
    const table = this.getTable(name);
    const keep = [];
    let n = 0;
    for (const row of table.rows) {
      if (this.parseWhere(m[2], this.wrapRow(name, row))) {
        if (name === 'penduduk' && String(row.nik) === '9999999999999999') this.audit.deletedTrial = true;
        n++;
      } else keep.push(row);
    }
    table.rows = keep;
    return { type: 'ok', affected: n, message: `Query OK, ${n} row${n === 1 ? '' : 's'} affected` };
  }

  wrapRow(table, row) {
    const out = {};
    for (const [k, v] of Object.entries(row)) {
      out[k] = v;
      out[`${table}.${k}`] = v;
    }
    return out;
  }

  resolveField(row, field) {
    const f = this.normalizeIdent(field);
    if (Object.prototype.hasOwnProperty.call(row, f)) return row[f];
    const tail = f.includes('.') ? f.split('.').pop() : f;
    if (Object.prototype.hasOwnProperty.call(row, tail)) return row[tail];
    return undefined;
  }

  select(q) {
    const main = q.match(/^SELECT\s+([\s\S]+?)\s+FROM\s+([`\w]+)([\s\S]*)$/i);
    if (!main) throw this.err(1064, '42000', 'Invalid SELECT syntax');
    const selectPart = main[1].trim();
    const baseName = this.normalizeIdent(main[2]);
    const base = this.getTable(baseName);
    let rest = main[3] || '';

    let orderBy = null, orderDir = 'ASC', groupBy = null, where = null;
    const orderM = rest.match(/\s+ORDER\s+BY\s+([`\w.]+)(?:\s+(ASC|DESC))?\s*$/i);
    if (orderM) {
      orderBy = this.normalizeIdent(orderM[1]); orderDir = (orderM[2] || 'ASC').toUpperCase();
      rest = rest.slice(0, orderM.index);
    }
    const groupM = rest.match(/\s+GROUP\s+BY\s+([`\w.]+)\s*$/i);
    if (groupM) {
      groupBy = this.normalizeIdent(groupM[1]); rest = rest.slice(0, groupM.index);
    }
    const whereM = rest.match(/\s+WHERE\s+([\s\S]+)$/i);
    if (whereM) {
      where = whereM[1].trim(); rest = rest.slice(0, whereM.index);
    }

    let rows = base.rows.map(r => this.wrapRow(baseName, r));
    const joinRe = /\s+(?:INNER\s+)?JOIN\s+([`\w]+)\s+ON\s+([`\w.]+)\s*=\s*([`\w.]+)/ig;
    let jm;
    while ((jm = joinRe.exec(rest)) !== null) {
      const joinName = this.normalizeIdent(jm[1]);
      const joinTable = this.getTable(joinName);
      const leftKey = this.normalizeIdent(jm[2]);
      const rightKey = this.normalizeIdent(jm[3]);
      const combined = [];
      for (const left of rows) {
        for (const jr of joinTable.rows) {
          const right = this.wrapRow(joinName, jr);
          const merged = { ...left, ...right };
          if (String(this.resolveField(merged, leftKey)) === String(this.resolveField(merged, rightKey))) combined.push(merged);
        }
      }
      rows = combined;
    }

    if (where) rows = rows.filter(r => this.parseWhere(where, r));

    const exprs = selectPart === '*' ? ['*'] : this.splitTopLevel(selectPart);
    let resultRows = [];
    let columns = [];

    const hasCount = exprs.some(e => /COUNT\s*\(\s*\*\s*\)/i.test(e));
    if (groupBy && hasCount) {
      const groups = new Map();
      for (const r of rows) {
        const key = String(this.resolveField(r, groupBy));
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(r);
      }
      const projected = [];
      for (const [, groupRows] of groups) {
        const first = groupRows[0];
        const obj = {};
        for (const exp of exprs) {
          const countM = exp.match(/^COUNT\s*\(\s*\*\s*\)(?:\s+AS\s+([`\w]+))?$/i);
          if (countM) {
            const alias = this.normalizeIdent(countM[1] || 'COUNT(*)');
            obj[alias] = groupRows.length;
          } else {
            const fm = exp.match(/^([`\w.]+)(?:\s+AS\s+([`\w]+))?$/i);
            if (!fm) throw this.err(1064, '42000', `Unsupported SELECT expression '${exp}'`);
            const alias = this.normalizeIdent(fm[2] || fm[1].split('.').pop());
            obj[alias] = this.resolveField(first, this.normalizeIdent(fm[1]));
          }
        }
        projected.push(obj);
      }
      columns = Object.keys(projected[0] || {});
      resultRows = projected;
    } else if (exprs.length === 1 && exprs[0] === '*') {
      columns = base.schema.order.slice();
      resultRows = rows.map(r => Object.fromEntries(columns.map(c => [c, this.resolveField(r, `${baseName}.${c}`)])));
    } else {
      resultRows = rows.map(r => {
        const obj = {};
        for (const exp of exprs) {
          const fm = exp.match(/^([`\w.]+)(?:\s+AS\s+([`\w]+))?$/i);
          if (!fm) throw this.err(1064, '42000', `Unsupported SELECT expression '${exp}'`);
          const field = this.normalizeIdent(fm[1]);
          const alias = this.normalizeIdent(fm[2] || field.split('.').pop());
          const val = this.resolveField(r, field);
          if (val === undefined) throw this.err(1054, '42S22', `Unknown column '${field}' in 'field list'`);
          obj[alias] = val;
        }
        return obj;
      });
      columns = Object.keys(resultRows[0] || Object.fromEntries(exprs.map(e => [e, null])));
    }

    if (orderBy) {
      resultRows.sort((a, b) => {
        const av = this.resolveField(a, orderBy); const bv = this.resolveField(b, orderBy);
        if (av == null && bv == null) return 0;
        if (av == null) return 1; if (bv == null) return -1;
        const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
        return orderDir === 'DESC' ? -cmp : cmp;
      });
    }

    return { type: 'table', columns, rows: resultRows.map(o => columns.map(c => o[c])) };
  }
}

if (typeof module !== 'undefined') module.exports = MiniSQL;
