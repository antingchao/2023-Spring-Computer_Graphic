#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <fcntl.h>

#define ERR    (-1)            
#define READ   0                
#define WRITE  1              
#define STDIN  0            
#define STDOUT 1              

int main()
{
    int pid_1,               /* will be process id of first child - who */
        pid_2,               /* will be process id of second child - wc */
        pid_3,
        pfd[2],              /* pipe file descriptor table.             */
        pfd2[2];

    if ( pipe ( pfd ) == ERR || pipe(pfd2)==ERR ){ 
        perror (" ");
        exit (ERR);
    }

    if (( pid_1 = fork () ) == ERR){        /* create 1st child   */
        perror (" ");
        exit (ERR);
    }
    if ( pid_1 != 0 ) {                     /* in parent  */
        
        if (( pid_2 = fork () ) == ERR){     /* create 2nd child  */
            perror (" ");
            exit (ERR);
        }
        if ( pid_2 != 0 ){                 /* still in parent  */
            
            if(( pid_3 = fork () ) == ERR){ /* create 3rd child  */
                perror (" ");
                exit (ERR);
            }
            if(pid_3 != 0 ){ /* still in parent  */
                close ( pfd [READ] );         /* close pipe in parent */
                close ( pfd [WRITE] );        /* conserve file descriptors */
                close ( pfd2 [READ] );         /* close pipe in parent */
                close ( pfd2 [WRITE] );        /* conserve file descriptors */
                waitpid(pid_1, NULL, 0);           /* wait for children to die */
                waitpid(pid_2, NULL, 0);
                waitpid(pid_3, NULL, 0);
            }
            else{ /* in 3rd child   */
                int file_fd = open("the_result", O_WRONLY | O_CREAT | O_TRUNC, 0666);
                if (file_fd == ERR) {
                    perror("open");
                    exit(ERR);
                }
                close(STDIN);
                dup(pfd2[READ]);
                close(pfd[READ]);
               
                close(STDOUT);
                dup(file_fd); /* write to test.txt */
                close(file_fd);
                close(pfd[WRITE]);
                close(pfd2[READ]);
                close(pfd2[WRITE]);
                // execlp ("wc", "wc", (char *)NULL);
                execl ("/usr/bin/wc", "wc", NULL);
            }
           
        }
        else{                                /* in 2nd child   */
            close (STDIN);           /* close standard input */
            close(STDOUT);
            dup ( pfd [READ] );      /* read end of pipe becomes stdin */
            dup(pfd2[WRITE]);
            close ( pfd [READ] );            /* close unneeded I/O  */
            close ( pfd [WRITE] );           /* close unneeded I/O   */
            close(pfd2[READ]);
            close (pfd2[WRITE]);  
           
            execl ("/usr/bin/grep", "grep", "vboxuser", NULL);
        }
    }
    else{                                   /* in 1st child   */
        close (STDOUT);            /* close standard out */
        dup ( pfd [WRITE] );       /* write end of pipes becomes stdout */
        close ( pfd [READ] );                 /* close unneeded I/O */
        close ( pfd [WRITE] );                /* close unneeded I/O */
        close(pfd2[READ]);
        close(pfd2[WRITE]);
        execl ("/usr/bin/ps", "ps", "aux", NULL);
    }
    exit (0);
}
