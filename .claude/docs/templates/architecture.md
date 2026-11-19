# Architecture: how <Project>'s parts fit together

Template from the setup kit. Copy to `.claude/docs/architecture.md` once the project has code, write it from the real
files (never from memory), keep it under 120 lines, plain English, short sections. Delete these two lines.

## The picture
A simple text diagram: where the app runs, what it talks to, and through which door.

## Screens
Where the screens live, how one is chosen (router or sign-in state), and the order a person meets them.

## Shared pieces
Where the shared components live and which list is the closed inventory (DESIGN.md, R-35).

## Data
A table of each table or store: its name and what it holds, in one line each.

## Who may see or change what
The security rules in plain words, one line per table or area, plus any helper functions they rely on.

## Sign-in flows
A table: flow, how it works, status (done, in progress, planned).

## How the app reaches its server
The path a request takes (proxy, address, network), and which keys the app holds (public only).

## Wrappers and builds
Phone or desktop wrapper, how it loads the app in development and in a release build.

## What runs where
A table: each part, where it runs today, where it runs later (point to the decision that says so).

## Keep this current
Update this file in the same change whenever a screen, table, security rule or sign-in flow is added.
