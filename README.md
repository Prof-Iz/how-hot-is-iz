# How Hot is Iz? 🔗 https://how-hot-is-iz.vercel.app/

Last Edited: March 30 2022

Tags:    `node` `sveltekit` `thingspeak` `matlab`

Status: ✅ Fully Complete

## What is this?

A simple IoT page made to collect data from a DHT 11 sensor and sync it with MATLAB Thingspeak. Mathematical analysis was done on the collected data and embedded in the app using Thingspeak visualizations. Graph was made with [Apex Charts](https://github.com/galkatz373/svelte-apexcharts) for interactivity.



![](D:\Projects\Project_README\how-hot-is-iz\images_readme\2022-05-05-06-59-17-image.png)

## Tech Stack Used

| Section   | Technology Used                   |
|:--------- |:--------------------------------- |
| Front End | Sveltekit, Tailwind CSS, Daisy UI |
| Back End  | Node, Vercel                      |
| Database  | Thingspeak                        |

## Current Issues

1. As the data is retrieved from Thingspeak API, to mimic real-time functionality a function is run every 30 seconds after the initial data fetching to hydrate the graph if it is a new point. However, this refresh causes the graph to zoom out if it is zoomed in. Solution maybe to use another charting package like Chart JS.

2. The Thingspeak API has a limit of 8000 points. Thus if we want all the points we need to chain multiple requests. However 8000 points causes a significant performance drop in the graph interactivity. Therefore we only take average daily values on initial page load.

## Future Plans

As the project was done for the Data Communication and Networking Course in University - and it fulfilled the requirements - no follow up will be made for this project.

____

### Socials

[LinkedIn](https://www.linkedin.com/in/ibrahimizdhanofficial/)
