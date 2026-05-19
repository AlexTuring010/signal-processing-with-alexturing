t = -1:0.01:6;
u = @(t) (t >= 0);
x = @(t) exp(-5*(t - 1)) .* u(t);
y1 = @(t) 3*cos(x(t));
y2 = @(t) 3*cos(t) .* x(t);

figure;
subplot(3,1,1);
plot(t, y1(t));
title('y(t) = 3cos(x(t))');
xlabel('t');
ylabel('y(t)');
grid on;

subplot(3,1,2);
plot(t, y1(t-2), 'm');
title('y(t-2) = 3cos(x(t-2))');
xlabel('t');
ylabel('y(t)');
grid on;

subplot(3,1,3); 
plot(t, 3*cos(x(t-2)), 'g');
title('S{x(t-2)}');
xlabel('t');
ylabel('y(t)');
grid on;

% Το y(t) = 3cos(t)x(t) δεν είναι χρονικά αμετάβλητο
figure;
subplot(3,1,1);
plot(t, y2(t));
title('y(t) = 3cos(t)x(t)');
xlabel('t');
ylabel('y(t)');
grid on;

subplot(3,1,2);
plot(t, y2(t-2), 'r');
title('y(t-2) = 3cos(t)x(t-2)');
xlabel('t');
ylabel('y(t)');
grid on;

subplot(3,1,3); 
plot(t, 3*cos(t) .* x(t-2), 'y');
title('S{x(t-2)}');
xlabel('t');
ylabel('y(t)');
grid on;