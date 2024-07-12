# UPT Token Balance Tracker for dePioneers DAO

## Overview
This project is a Solana token (UPT) balance tracker that monitors and records the balance changes of dePioneers DAO. It utilizes the Solana Web3.js library to interact with the Solana blockchain and stores balance information in a MongoDB database. The backend is built with Node.js and Express, providing an API to retrieve stored balance data.

## Features
- Fetches and updates the balance of specified Solana token accounts.
- Saves balance changes to a MongoDB database for historical tracking.
- Provides an API endpoint to post balance data.
- Scheduled tasks for balance updates at regular intervals.