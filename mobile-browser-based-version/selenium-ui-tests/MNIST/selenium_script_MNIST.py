""" Runs the MNIST task on DeAI or FeAI.

Constants: 
Use 'PLATFORM' to choose the platform (FeAI or DeAI)
Use `DIGIT_CLASS_PATHS` to point to the digit folders. 
Use `NUM_IMAGES` to limit the number of images per peer to test faster.
Use `NUM_PEERS` to define the number of peers to run.
Use `TRAINING_TYPE` to choose between training alone or distributed.
Use `TRAINING_MODE` to choose between Decentralised or Federated.
Use `DATA_SPLIT` to choose the data split
Use `TIME_OFFSETS` to choose the time offsets to simulate asynchronous learning

How to run:
python selenium_script_MNIST.py
"""

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time
from selenium.webdriver.common.action_chains import ActionChains
from webdriver_manager.chrome import ChromeDriverManager

import sys,os

sys.path.append(os.path.realpath('..'))

from util import find_task_page, generate_report, get_files, partition, r_partition, s_partition, start_training

#Platform
PLATFORM = 'https://epfml.github.io/DeAI/#/'
#Pick between local and Federated or Decentralised
TRAINING_MODE = 'Decentralised'
# Defines how many browser tabs to open
NUM_PEERS = 2
# Defines the way to split the data, could be 'iid' for iid data, 'partition' for even size partitions, 'rpartition' for random size partitions
# 'spartition' for partition of sizes past as argument RATIOS
DATA_SPLIT = 'rpartition'
#sparition ratios of data splits
RATIOS = [0.5, 0.3, 0.2]
#You can set time offsets for nodes to join at variable times
TIME_OFFSETS = [0, 0, 0]
# Should match the name of the task in the task list and is case sensitive
TASK_NAME = 'MNIST'
# can be either 'Train Alone' or 'Train Distributed'. Should match the text of the button in the train screen.
TRAINING_TYPE = 'decentralised' 
#Number of images to train with
NUM_IMAGES = 20
# Digit folder paths, change to \ for macOS
DIGIT_CLASS_PATHS = [
    r'0',
    r'1',
    r'2',
    r'3',
    r'4',
    r'5',
    r'6',
    r'7',
    r'8',
    r'9'
]

start_time = time.time()

op = webdriver.ChromeOptions()
op.add_argument('headless') 
drivers = [webdriver.Chrome(ChromeDriverManager().install()) for i in range(NUM_PEERS)]

digit_files = [get_files(DIGIT_CLASS_PATHS[i], NUM_IMAGES, '.jpg') for i in range(len(DIGIT_CLASS_PATHS))]

if DATA_SPLIT == 'partition':
    digit_partitions = [partition(digit_files[i], NUM_PEERS) for i in range(len(digit_files))]
elif DATA_SPLIT == 'rpartition':
    digit_partitions = [r_partition(digit_files[i], NUM_PEERS) for i in range(len(digit_files))]
elif DATA_SPLIT == 'spartition':
    digit_partitions = [s_partition(digit_files[i], RATIOS) for i in range(len(digit_files))]

for index, driver in enumerate(drivers):
    find_task_page(driver, PLATFORM, TASK_NAME, TRAINING_MODE)
    time.sleep(8)
    if DATA_SPLIT == 'iid':
        for i in range(len(DIGIT_CLASS_PATHS)):
            driver.find_element_by_id('hidden-input_mnist_' + str(i)).send_keys(' \n '.join(digit_files[i]))
    else:
         for i in range(len(DIGIT_CLASS_PATHS)):
            driver.find_element_by_id('hidden-input_mnist_' + str(i)).send_keys(' \n '.join(digit_partitions[i][index]))

# Start training on each driver
time.sleep(8)
start_training(drivers, TRAINING_TYPE, TIME_OFFSETS)
time.sleep(5)

generate_report('report.txt', \
    drivers, \
    start_time, \
    '//*[@id="app"]/div/div/div/div/div/div/div/main/div/div/div[3]/div/div[1]/div/div[2]/p/span[1]', \
    '//*[@id="app"]/div/div/div/div/div/div/div/main/div/div/div[3]/div/div[1]/div/div[1]/p/span[1]', \
    10)


for driver in drivers:
    driver.quit()

