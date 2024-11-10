FROM redis:7.2-alpine

# Copy custom Redis configuration
COPY redis.conf /usr/local/etc/redis/redis.conf

# Create directory for Redis data
RUN mkdir -p /data && chown redis:redis /data

# Set working directory
WORKDIR /data

# Expose Redis port
EXPOSE 6379

# Start Redis with the custom configuration
CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]