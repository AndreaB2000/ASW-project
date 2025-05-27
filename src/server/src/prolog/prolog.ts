const pl = require('tau-prolog');
import fs from 'fs';
import path from 'path';

const session = pl.create(1000);

/**
 * Initializes the Prolog engine by loading the Prolog file.
 * @returns true if Prolog is ready, false otherwise.
 */
const init = async (): Promise<void> => {
  try {
    const prologFilePath = path.resolve(__dirname, './bot.pl');

    const program = fs.readFileSync(prologFilePath, 'utf8');

    return new Promise((resolve, reject) => {
      session.consult(program, {
        success: function () {
          resolve();
        },
        error: function (error: any) {
          console.error('Error consulting Prolog program:', error);
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error('Error loading Prolog file:', error);
    return Promise.reject(error);
  }
};

/**
 * Queries the Prolog engine with a given goal.
 * @param goal the Prolog goal to query.
 * @returns the results of the query as an array of strings.
 */
export const query = async (goal: string): Promise<string[]> => {
  await init();

  return new Promise((resolve, reject) => {
    session.query(goal, {
      success: () => {
        const results: string[] = [];

        const handleAnswer = (answer: any) => {
          if (answer === false || answer === null) {
            resolve(results);
          } else {
            results.push(session.format_answer(answer));
            session.answer(handleAnswer);
          }
        };

        session.answer(handleAnswer);
      },
      error: (err: any) => reject(err),
    });
  });
};
