import fs from 'fs';
import _ from 'lodash';
import { loadTasks } from '../task_definition/helper.js';
import { logger } from '../logging/logger.js';
/*
 * For command line interface
 */

async function loadTask(taskID) {
  const tasks = await loadTasks(true);
  var task = _.filter(tasks, (t) => t.taskID == taskID);
  if (task.length == 0) {
    logger.error(`Task ${taskID} is not valid`);
    return undefined;
  }
  return task[0];
}

function loadFiles(dataDir, fileUploadManager) {
  fs.readdir(dataDir, function (err, files) {
    //handling error
    if (err) {
      logger.error(`Unable to scan data directory: ${err}`);
    }
    //listing all files using forEach
    files.forEach(function (file) {
      fileUploadManager.addFile(URL.createObjectURL(file), file, file.name);
    });
  });
}

export { loadTask, loadFiles };
