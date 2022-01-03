My project template for learning Next.js that includes TypeScript, Tailwind CSS, Mongoose, ESLint, and Prettier. Also includes some basic code examples.

---

## Copy Project Template with `create-next-app`

`create-next-app` has an optional `--example` flag that will bootstrap a new project based on an existing GitHub repository. To create a new project from this template, run the following command:

```
npx create-next-app my-app --use-npm --example https://github.com/mqunell/nextjs-template
```

---

## Recreate the Project Step-by-Step

### Next.js

Use `create-next-app` to generate a barebones Next.js project

```
npx create-next-app my-app --use-npm
```

### TypeScript

1. Create tsconfig.json in the root of the project
   ```
   touch tsconfig.json
   ```
2. Install dependencies
   ```
   npm install --save-dev typescript @types/react @types/node
   ```
3. Start the development server. This will cause Next.js to populate `tsconfig.json` and create `next-env.d.ts`
   ```
   npm run dev
   ```

<sub>See the [Next.js guide](https://nextjs.org/learn/excel/typescript/create-tsconfig) for more information.</sub>

### Tailwind CSS

1. Install dev dependencies
   ```
   npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
   ```
2. Create default configuration files
   ```
   npx tailwindcss init -p
   ```
3. Add tree-shaking to production builds by modifying `tailwind.config.js`
   ```
   - purge: []
   + purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}']
   ```
4. Include Tailwind in one of two ways
   - Import Tailwind directly in \_app.js
   - Include Tailwind in globals.css

<sub>See the [Tailwind CSS guide](https://tailwindcss.com/docs/guides/nextjs) for more information.</sub>

### Mongoose

1. Set up the MongoDB Atlas project
   - Configure network access by allowing 0.0.0.0/0 for Vercel deployment
   - Configure database access user credentials _(this will be a different password than the account password!)_
2. Install Mongoose package
   ```
   npm install mongoose
   ```
3. Create .env.local file
   ```
   MONGODB_URI=<Atlas URI>
   ```
4. Copy the `lib/dbConnect.ts` file for boilerplate database connection code

<sub>See the [Next.js GitHub example repository](https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/README.md) for more information.</sub>

### ESLint and Prettier

ESLint is integrated with Next.js, but Prettier is not installed or configured by default.

1. Install Prettier dev dependency
   ```
   npm install --save-dev eslint-config-prettier
   ```
2. Add Prettier to `.eslintrc.json`
   ```
   - "extends": ["next/core-web-vitals"]
   + "extends": ["next/core-web-vitals", "prettier"]
   ```
3. Copy the `.prettierrc.json` file for boilerplate code formatting rules

<sub>See the [Next.js tools guide](https://nextjs.org/docs/basic-features/eslint#usage-with-other-tools) for more information.</sub>

### Deployment

[Vercel](https://vercel.com/) is recommended for deploying Next.js applications.

Simply follow the steps, which include connecting to a GitHub repository and entering environment variables (ex. MONGODB_URI), to host the app online.
