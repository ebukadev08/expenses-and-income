FROM nginx:alpine

# Remove pxxl/nginx default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom config
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy React build
COPY build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
