FROM node:lts as builder

WORKDIR /app
COPY package*.json ./
RUN npm install # Або залиште install, якщо ci не працює
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]