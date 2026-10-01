// Additive bootstrap for both an empty database and the earlier academy schema.
// Never drops tables/columns or rewrites existing student/course records.
export function additiveStatements(source) {
  const statements = source.split('--> statement-breakpoint').map(s => s.trim()).filter(Boolean);
  const tables = [];
  const columns = [];
  const constraints = [];
  const indexes = [];
  for (const statement of statements) {
    const table = statement.match(/^CREATE TABLE "([^"]+)" \(([\s\S]+)\);$/);
    if (table) {
      tables.push(statement.replace('CREATE TABLE ', 'CREATE TABLE IF NOT EXISTS '));
      for (const line of table[2].split('\n')) {
        const column = line.trim().replace(/,$/, '');
        if (!column.startsWith('"')) continue;
        // Historical rows may not have values for newly introduced fields.
        const definition = column.replace(' PRIMARY KEY', '').replace(' NOT NULL', '');
        columns.push(`ALTER TABLE "${table[1]}" ADD COLUMN IF NOT EXISTS ${definition};`);
      }
    } else if (statement.startsWith('ALTER TABLE ')) {
      constraints.push(`DO $$ BEGIN ${statement} EXCEPTION WHEN duplicate_object THEN NULL; END $$;`);
    } else if (/^CREATE (UNIQUE )?INDEX /.test(statement)) {
      indexes.push(statement.replace(/^(CREATE (?:UNIQUE )?INDEX) /, '$1 IF NOT EXISTS '));
    } else throw new Error('Unsupported bootstrap statement');
  }
  return [...tables, ...columns, ...constraints, ...indexes];
}
