#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <string.h>

int main(){
    char str[1001] = {0}; // "a bc def"
    char str2[1001] = {0}; // -> "(a) (bc) (def)"
    gets(str);

    const char split[2] = " ";
    char *token;
   
    token = strtok(str, split);
    int first = 1;
    while( token != NULL ) {
        if(!first){
            strcat(str2, " ");
        }
        strcat(str2, "(");
        strcat(str2, token);
        strcat(str2, ")");

        token = strtok(NULL, split);
        first = 0;
    }
    puts(str2);
    return 0;
}