#/bin/bash

systemctl --user stop pulseaudio.socket
systemctl --user stop pulseaudio.service
systemctl --user stop pipewire.socket
systemctl --user stop pipewire.service

sudo rmmod snd_soc_skl_nau88l25_ssm4567
lsmod | grep snd | cut -d \  -f 1 | xargs -I$ -d "\n" sudo rmmod $
