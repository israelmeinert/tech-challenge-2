#!/bin/bash

# Update package lists
apt-get update

# Install required dependencies
apt-get install -y wget

# Download and install libssl1.1
wget http://archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2_amd64.deb
dpkg -i libssl1.1_1.1.1f-1ubuntu2_amd64.deb

# Clean up
rm libssl1.1_1.1.1f-1ubuntu2_amd64.deb

# Install build essentials
apt-get install -y build-essential
