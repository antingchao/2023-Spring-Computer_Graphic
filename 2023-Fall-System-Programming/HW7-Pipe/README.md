## Using Pipe

This C program demonstrates inter-process communication (IPC) using pipes. It creates three child processes, each responsible for running a different command in a Unix-like system. The results are passed between the processes using pipes, and the final output is written to a file named `the_result`.

## Output
The filtered result of the ps aux command, after being passed through grep vboxuser and processed by wc, will be written to a file named the_result.