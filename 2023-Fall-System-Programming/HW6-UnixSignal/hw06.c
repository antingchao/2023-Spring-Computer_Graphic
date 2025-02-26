#include <stdio.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <sys/signal.h>

int handling_ctrl();
int handling_alrm();

void main(){
    signal(SIGINT, handling_ctrl);
    signal(SIGALRM, handling_alrm);
    alarm(10);
    for(;;){

    }
}

int handling_ctrl(sig)
int sig;{
    int pid = fork();
    if(pid==0){
        execlp("uptime", "uptime", NULL);
    }
    int pid2 = fork();
    if(pid2==0){
        execlp("who", "who", NULL);
    }
}

int handling_alrm(sig)
int sig;{
    int pid = fork();
    if(pid==0){
        execlp("uptime", "uptime", NULL);
    }
    int pid2 = fork();
    if(pid2==0){
        execlp("who", "who", NULL);
    }
    alarm(10);
}