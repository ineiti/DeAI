import path from 'path';

/**
 * File containing all cli constants, e.g. absolute paths
 * to resources, or URIs.
 */

/**
 * Root directory of the server app.
 */
export const ROOT_DIR = path.dirname(new URL(import.meta.url).pathname);
/**
 * Directory containing all task definition files.
 */
export const DATA_DIR = (dataDir) => path.join(ROOT_DIR, dataDir);
/**
 * Files that are not considered valid by the CLI
 */
export const FILTER_FILES = new Set(['.DS_Store']);
