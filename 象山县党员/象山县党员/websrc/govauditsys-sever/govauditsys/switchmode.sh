if [ -f webpack.config.js-compression ]; then
    mv webpack.config.js webpack.config.js-full
    mv webpack.config.js-compression webpack.config.js
else
    mv webpack.config.js webpack.config.js-compression
    mv webpack.config.js-full webpack.config.js
fi
