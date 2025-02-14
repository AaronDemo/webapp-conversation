# 构建阶段
FROM --platform=linux/amd64 node:19-bullseye-slim AS builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install

COPY . .  
RUN yarn build

# 运行时阶段  
FROM --platform=linux/amd64 node:19-bullseye-slim AS runtime

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

CMD ["yarn", "start"]
