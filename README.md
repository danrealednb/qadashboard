# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`

## Docker

`docker build . -t qadashboard`

`docker run -p 3000:3000 -v $(pwd)/app:/qadashboard/app --env-file .env -it qadashboard`

### ENV FILE

- `.env` Goes at root of project

```
TEST_RAIL_INSTANCE=instance_name.testrail.io
TEST_RAIL_API_KEY=apikey
JIRA_CREDENTIALS=email/apikey
DATABASE_PATH=./qa.db
JIRA_INSTANCE=company.atlassian.net
JIRA_PROJECT=Abbreviation
TEST_RAIL_PROJECT_ID=1
```

- Do not use quotes or double quotes in .env file. Docker treats those as characters

#### Setup

Go to `app/utils/testTypes.ts` and add in the test types

Assumes that the test rail instance has fields `custom_automated_test` and `custom_test_case_type`
