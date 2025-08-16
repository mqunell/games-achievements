### [Games and Achievements](https://games.mattqunell.com/) on Vercel

---

### What is It?

Games and Achievements is an interactive site for viewing stats about the video games I play, including platforms, recent and total playtimes, achievement names, personal and global completion percentages, and more. Display options provide different ways of viewing, filtering, and sorting the data.

---

### Development Overview

This was an important project in my web development career when I first started working on it. I upgraded from a barebones MERN stack to many new technologies, including Next.js with static page generation, TypeScript, Tailwind CSS, and Framer Motion. I also worked a lot with the [Steam API](https://developer.valvesoftware.com/wiki/Steam_Web_API 'Steam API') and designed a method of aggregating data across multiple endpoints and caching it in a JSON file, which was then used to build the home page and every individual game page without duplicating API calls.

There have been some interesting changes over the years since this project was started. Aggregated Steam data has moved from JSON files to MongoDB, and then later to Postgres. There is now a daily cron that intelligently determines which games need to be updated. Tools like msw have been implemented for more robust mocking and testing. I will continue returning to this project and adding new features from time to time.

---

### Tech Stack

**Frontend**: Next.js React

- Tailwind CSS
- Headless UI components
- Framer Motion page transitions and other animations

**Backend**: Next.js serverless functions

- Daily cron that aggregates, formats, and upserts data only for games that it determines need to be updated

**Database**: Neon PostgreSQL

**Hosting**: Vercel with automatic deployments from GitHub

- Automatic deployment from GitHub

**Other**:

- Steam API
- TypeScript

---

### Interesting Challenges

#### Aggregating Steam and Xbox data

The **Steam** API is easy enough to use when considering individual endpoints, but using multiple to collect data revealed some inconsistencies and a lack of functionality overall:

- Games are referred to as "games" and "apps" interchangeably, both in GET requests and the returned data
- I could not retrieve the descriptions of achievements that are hidden by default, regardless of whether they are unlocked on my account
- Games' achievements cannot be queried directly; they must be queried as a _user's_ list of achievements for that game (which was a problem with Xbox data; see below)

In order to aggregate the data from Steam, I needed to use three different endpoints and format their returned data more consistently.

**Xbox**, surprisingly, does not have an available API for users' libraries and achievements whatsoever. Instead, I pull the metadata from Steam and modify personal fields like total playtime as necessary. The process looks like this:

1. Find the Steam ID for an Xbox games I want to pull data for
2. Find a player who owns that games and has a public profile
3. Make API calls, verify I get all of the metadata back, and then copy/paste it into `server/manualUpsert.ts`
4. Update personal fields
5. Run the script

I used to have more code that assisted with this, but it got to be more trouble than it was worth. Adding Xbox games is such a rare occurence nowadays that it's simpler to use a tool like Bruno for making the requests and leave the script to just formatting and upserting.

#### Animations and Page Transitions

**Headless UI** components were part of this site's design from the beginning, and the Transition component was initially how I handled all of the animations. It was the logical thing to do; I was working with the same library and docs, and still using Tailwind CSS for styling.

This changed after I came across the idea of using **Framer Motion** for page transitions, which was not a feature I initially planned to have, but immediately wanted. The key to making page transitions work is Motion's AnimatePresence component, which manages a very interesting gap in the React component lifecycle I hadn't noticed before: unmounting. AnimatePresence is crucial for this design because it allows the current page to animate out before the next page loads and animates in. Once I understood that concept, implementing basic page transitions was surprisingly simple.

At this point I decided to **refactor** the Headless UI Transition animations into Motion components since they are slightly easier to write and maintain, despite not using Tailwind CSS.

---

### Results

Steam's API is messy and Xbox's is non-existent, but I have a streamlined and mostly automated way of tracking my video game stats now. I am considering expanding on the platform and providing people with a way of viewing their own stats in the same way, but it would likely be limited to Steam due to the very specific process of managing Xbox data.

I experimented with a new stack while working on this site and liked it so much that I created a [project template](https://github.com/mqunell/nextjs-template 'project template GitHub repository') based on it that includes Next.js, TypeScript, Tailwind CSS, code stubs, and more.

Deploying on Vercel was also far simpler than deploying my previous project, [Movies Library](https://github.com/mqunell/MoviesLibrary 'Movies Library'), on Heroku. I didn't need to create special config files, push to a separate repository, or deal with a server that constantly puts itself to sleep. I can't speak for deploying non-Next.js apps on Vercel, but in this case it was an exceptional process.
