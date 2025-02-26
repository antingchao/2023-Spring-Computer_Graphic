## Unix Signal

This C program continuously runs the `uptime` and `who` commands in two scenarios:
1. When the user presses `Ctrl+C` (SIGINT signal).
2. Every 10 seconds (via an alarm signal).
