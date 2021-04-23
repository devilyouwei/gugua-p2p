# GuGua

![logo](./readme/logo.png)

GuGua is a decentralized social network just like Twitter but based on blockchain and decentralized.

## Gugua P2P

This repo is the server side of **GuGua Network**, another word it will create a peer of P2P network.

-   A peer can handle all the client side request, processing data, response.

-   A peer can connect and sync with other peers in the P2P network.

-   A peer should keep blockchain working properly and stable.

-   Only on the server side, you can do the mining work (POS or POW).

## Client Side

Server side doesn't contain a user interface.

GuGua Network uses the mode of "front-back separation".

For the client side of GuGua, please refer to another repo: [gugua-cli](https://github.com/devilyouwei/gugua-cli)

## What is DeSN?

**DeSN** is "Decentralized Social Network" which gives up the central server to store and handle users' social
information including: user accounts, user relations, user posts and etc.

The main purpose is to create a twitter-like software on blockchain!

We regard users as nodes, nodes refers to both servers and clients. Nodes are connected together through a P2P network.
The social information of users is recorded in the way of blockchain accounting.

## Basic Requirements

1. User register and login
2. User post messsages
3. Add connection with others, become friends or other relationships
4. Edit some user info
5. Remove relationships with others
6. Make NFT online
7. Buy and sell NFT post: text, video, voice
8. Transaction in crypto currency

## The Blueprint of GuGua

Let's see what is GuGua Network through the following figure.

![network](./readme/gugua-diagram.png)

## Get Started

```bash
# install libs
yarn install

# run development env
yarn run dev

# build this project
yarn run build
```

Enter `http://localhost:3000` in browser to check if the local server runs well.

## Update Logs

[2021/3/30] Implement a P2P network which can sync the peer list.

[2021/4/16] Add local http server by using express.

## Contributors

**devilyouwei** joined on Mar 5, 2021

We are looing forward to your join.

Let's create a totally decentralized social network!
