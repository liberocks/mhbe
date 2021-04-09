FROM mhart/alpine-node:12 as builder

# Set working directory to /app
WORKDIR /app

# Copy package json and yarn lock
COPY package*.json yarn.lock /app/

# Install app dependencies
RUN yarn

COPY . /app

RUN ["yarn","build"]
RUN ["rm","-rf","node_modules"]
RUN ["yarn","install","--production","--frozen-lockfile"]

FROM mhart/alpine-node:slim-12

WORKDIR /app

COPY --from=builder /app ./

EXPOSE $PORT 8000

CMD ["node", "dist/src/main"]
