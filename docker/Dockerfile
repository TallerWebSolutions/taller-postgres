FROM malera/es6

### CHANGE HERE YOUR USER ID TO DEVELOPMENT
ENV PERM_USER_ID 1000

### CREATE USER FOR DEVELOPMENT
RUN echo "%sudo ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers && \
    useradd -u ${PERM_USER_ID} -G users,www-data,sudo -d /taller --shell /bin/bash -m taller && \
    echo "secret\nsecret" | passwd taller

### IMPORT FILES TO ENVIRONMENT
COPY ./.bashrc /taller/.bashrc
COPY ./entrypoint.sh /etc/entrypoint.sh
RUN chmod +x /etc/entrypoint.sh
RUN chown taller:taller /taller/.bashrc

USER taller
WORKDIR /taller

CMD ["/bin/bash"]
ENTRYPOINT ["/etc/entrypoint.sh"]
