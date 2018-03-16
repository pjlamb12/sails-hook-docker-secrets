# sails-hook-docker-secrets

This is a [Sails.js hook](https://sailsjs.com/documentation/concepts/extending-sails/hooks) that loads Docker secrets, using [@cloudreach/docker-secrets](https://www.npmjs.com/package/@cloudreach/docker-secrets) to load the secrets as a JSON object, and merges them into the `sails.config` object. It only works for secrets that are meant to add into the `sails.config` object, just like [you would pass in config overrides as runtime variables](https://sailsjs.com/documentation/concepts/configuration#?setting-sailsconfig-values-directly-using-environment-variables). The secrets should be named as follows: `sails_myAttr` or `sails_myAttr__mySubAttr`.

To test this hook, you need to manually add a test secret to `/run/secrets` on your host machine:

```
sudo mkdir /run/
sudo mkdir /run/secrets
sudo vim /run/secrets/sails_testSecret
```

And in that file, place a single string that will be the value of that configuration key. The filename becomes the key, the contents of the file become the value.

If the file's name has a double underscore, that designates that the content to the right is a subattribute of the preceding section of the filename. So, for the secret stored at `/run/secrets/sails_myAttr__mySubAttr`, you will end with the following be appended to `sails.config`:

```
...
{
    myAttr: {
        mySubAttr: 'The value goes here'
    }
},
...
```

Any of the values that are read in here will overwrite anything else that was previously set on the `sails.config` object.
