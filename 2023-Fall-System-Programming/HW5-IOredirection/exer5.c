#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

int main(){

    int fd1 = open("foo.bar", O_RDONLY);
    int fd2 = open("result", O_RDWR);

    close(0); // close standard input
    dup(fd1);
    close(fd1);
    close(1); // close standard output
    dup(fd2);
    close(fd2);
    execlp("./a.out", "ls", "./a.out", NULL);

    return 0;
}