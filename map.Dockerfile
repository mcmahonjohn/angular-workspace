FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        apache2 \
        autoconf \
        build-essential \
        ca-certificates \
        curl \
        git \
        libapache2-mod-tile \
        libboost-all-dev \
        libbz2-dev \
        libexpat1-dev \
        libfreetype6-dev \
        libmapnik-dev \
        libpng-dev \
        libpq-dev \
        libproj-dev \
        libxml2-dev \
        mapnik-utils \
        osm2pgsql \
        postgis \
        postgresql \
        postgresql-contrib \
        python3 \
        python3-pip \
        python3-psycopg2 \
        sudo \
        tar \
        unzip \
        wget \
        zlib1g-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

CMD ["/entrypoint.sh"]
