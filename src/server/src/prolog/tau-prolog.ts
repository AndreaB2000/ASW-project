const pl = require('tau-prolog');
require('tau-prolog/modules/js');
import fs from 'fs';
import path from 'path';

const session = pl.create(1000);

/**
 * Initializes the Prolog engine by loading the Prolog file.
 * @returns true if Prolog is ready, false otherwise.
 */
const initProlog = async (): Promise<void> => {
  try {
    const prologFilePath = path.resolve(__dirname, './bot.pl');

    const program = fs.readFileSync(prologFilePath, 'utf8');

    // Return a promise for the consultation
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

// ask prolog for an answer
export const queryPrologEngine = async (goal: string): Promise<string[]> => {
  // Make sure Prolog is initialized before querying
  await initProlog();

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
