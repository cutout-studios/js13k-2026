export const logTable = <T extends Array<K>, K>(
  rows: T[],
  columns: string[],
  columnFormatters: Record<string, (value: K) => unknown> = {},
) => {
  console.table(
    rows.map((row) => {
      return row.reduce((object, cell, index) => {
        const columnName = columns[index];
        const columnFormatter = columnFormatters[columnName] ??
          ((value) => value);

        object[columns[index]] = columnFormatter(cell);

        return object;
      }, {} as Record<string, unknown>);
    }),
    columns,
  );
};
