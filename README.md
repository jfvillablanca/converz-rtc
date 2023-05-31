Converz
========

### A small real-time chat application with Discord-like rooms for chat threads.
![converz](https://github.com/jfvillablanca/converz-rtc/assets/31008330/9f4311b3-bdc9-43f8-8b92-4b19e054738f)


Features
--------

- Real-time communication powered by [Socket.IO](https://socket.io/)
- Active users on the room and on-chat notification if someone leaves or joins the room


https://github.com/jfvillablanca/converz-rtc/assets/31008330/eb6bb524-fab8-42db-bb15-60f473fa3034


- Rooms with their own chat threads


https://github.com/jfvillablanca/converz-rtc/assets/31008330/a8c9ac8b-1183-46c1-8e1d-c0b7d4002add



- Colorscheme, theme toggle, and UI components by [daisyUI 🌼](https://daisyui.com/)


https://github.com/jfvillablanca/converz-rtc/assets/31008330/2c47941f-347f-4a2b-9db4-2d1eeaddef28



Installation
------------

Starting a dev environment

```console
[$] git clone git@github.com:jfvillablanca/converz-rtc.git 
[$] cd converz-rtc
[$] npm install
[$] npm run dev
```

**If you use Nix and you isolate your dev environment (like a proper Nix user)**
- Make sure flakes are enabled
- Make sure you have direnv and nix-direnv enabled
- If you have both crossed out, you can `cd` to the cloned dir and run:  

```console
[$] direnv allow
```
- Voila! No need to `nix develop`. Everytime, you enter the directory, you now have `npm` in your runtime path 😊
- **Note**: you still have to do the `npm install` since node_modules is not managed by the flake.

Contribute
----------

- Feel free to open an issue/PR if you have a question, suggestion, whatever.

<!-- Support -->
<!-- ------- -->

<!-- If you are having issues, please let us know. -->
<!-- We have a mailing list located at: project@google-groups.com -->

License
-------

The project is licensed under the MIT license.
