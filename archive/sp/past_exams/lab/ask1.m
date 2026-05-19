t1 = linspace(0, 1, 100);
x1 = t1;

t2 = linspace(1, 2.5, 150);
x2 = exp(-5*t2 + 5);

t = [t1, t2];
x = [x1, x2];

t_total = [-2:0.01:12];
x_total = zeros(size(t_total));

for i = 1:length(t_total)
    t_index = mod(t_total(i), 2.5);
    if t_index <= 1
        x_total(i) = t_index;
    else
        x_total(i) = exp(-5*t_index + 5);
    end
end

figure;
plot(t_total, x_total, 'm');
grid on;
title('x(t)');
xlabel('t');
ylabel('x(t)');
