#
# 🧑‍💻 Development
#
FROM node:21-alpine3.18 as dev

# Create app folder
WORKDIR /app

# Set to dev environment
ENV NODE_ENV dev

# Copy source code into app folder
COPY . .

# Install dependencies, including sharp for musl
RUN yarn install --frozen-lockfile

RUN npx prisma generate
#
# 🏡 Production Build
#
FROM node:21-alpine3.18 as build


WORKDIR /app

# Set to production environment
ENV NODE_ENV production

# Copy dependencies from dev stage
COPY --from=dev /app/node_modules ./node_modules
# Copy source code
COPY . .

RUN npx prisma generate
# Generate the production build. The build script runs "nest build" to compile the application.
RUN yarn build

# Install only the production dependencies and clean cache to optimize image size.
RUN yarn install --frozen-lockfile --production && yarn cache clean

#
# 🚀 Production Server
#
FROM node:21-alpine3.18 as prod

WORKDIR /app

# Set to production environment
ENV NODE_ENV production

# Copy only the necessary files
COPY --from=build /app/dist dist
COPY --from=build /app/node_modules node_modules

# Expose port 3000
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]