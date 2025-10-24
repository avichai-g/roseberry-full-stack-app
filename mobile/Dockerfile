FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose the port that Expo uses
EXPOSE 8081

# Start the Expo development server in web mode
CMD ["npm", "start", "--", "--web"]
