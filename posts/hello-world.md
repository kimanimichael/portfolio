---
title: Hello, world
date: 2026-09-29
summary: Why I'm starting a blog, and what to expect here.
tags: [meta, writing]
---

This is the first post on the blog. I'll be writing about embedded systems,
mechatronics, my travel experiences and any other similar topics.

## What to expect

- Technical posts from my work and my personal projects
- Technical posts from my school work and research
- My travel experiences and adventures
- Explorations of my city and the world around me
- General musings on life, technology, and the world focused on mistakes I think I made

## Code renders too

```c
void blink(void) {
    gpio_set_level(LED_PIN, 1);
    vTaskDelay(pdMS_TO_TICKS(500));
    gpio_set_level(LED_PIN, 0);
}
```

