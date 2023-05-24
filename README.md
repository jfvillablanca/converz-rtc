Converz
========

A small real-time chat application with Discord-like rooms for chat threads.

Features
--------

- Real-time communication powered by [Socket.IO](https://socket.io/)
- Rooms with their own chat threads
- Active users on the room and on-chat notification if someone leaves or joins the room
- Colorscheme, theme toggle, and UI components by [daisyUI 🌼](https://daisyui.com/)

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
