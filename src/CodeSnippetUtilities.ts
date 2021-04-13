import { SUPPORTED_LANGUAGES } from './CodeSnippetLanguages';

/**
 * Test whether user typed in all required inputs.
 */
export function validateInputs(
  name: string,
  description: string,
  language: string
): boolean {
  let status = true;
  let message = '';
  if (name === '') {
    message += 'Name must be filled out\n';
    status = false;
  }
  if (language === '') {
    message += 'Language must be filled out';
    status = false;
  }
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    message += 'Language must be one of the options';
    status = false;
  }
  if (status === false) {
    alert(message);
  }
  return status;
}
