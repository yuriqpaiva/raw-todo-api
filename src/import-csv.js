import csvParser from 'csv-parser';
import fs from 'fs';

const csvFilePath = new URL('../imports.csv', import.meta.url);

fs.createReadStream(csvFilePath)
  .pipe(csvParser())
  .on('data', async (row) => {
    try {
      const task = {
        title: row.title,
        description: row.description,
      };

      fetch('http://localhost:3333/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
    } catch {
      console.error(
        'Error occurred while making the HTTP POST request:',
        error.message
      );
    }
  })
  .on('end', () => {
    console.log('CSV file processing finished.');
  })
  .on('error', (err) => {
    console.error('Error occurred while reading the CSV file:', err.message);
  });
