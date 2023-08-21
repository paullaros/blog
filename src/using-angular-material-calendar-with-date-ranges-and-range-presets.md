---
type: article
title: Using Angular Material's calendar with date ranges and range presets
image: images/using-angular-material-calendar-with-date-ranges-and-range-presets.png
description: Learn how to use Angular Material's calendar with date ranges and presets. Streamline date selection and enhance the user experience. Complete with code examples and implementation details.
date: 2023-08-21
tag: Angular
---

# Using Angular Material's calendar with date ranges and range presets

<center>

![Angular Material Calendar with Date Range and Range Presets](/images/angular-material-calendar-date-range.png)

</center>

Angular Material's calendar component is a valuable tool for handling date ranges in Angular applications. However, the existing documentation may be limited, and online examples often lack completeness or rely on unconventional methods, that's why we've decided to write this blog post.

While this post won't be a step-by-step tutorial, we'll explain all the relevant parts. Additionally, you can find a complete implementation, including the custom range preset buttons, on [StackBlitz](https://stackblitz.com/edit/angular-material-calendar-with-date-ranges-and-presets).

## Getting Started

We assume you're already familiar with Angular Material and the calendar component but are running into issues while setting it up to handle date ranges and custom date range presets. If you're not, no worries! You can start by checking out the official documentation on Angular Material's [website](https://material.angular.io/components/datepicker/overview#using-mat-calendar-inline).

## Setting Up Providers

To begin, we need to set up the necessary providers for the Angular Material calendar component. These providers enable the preview functionality. Here's an example of how to set up the providers:

```ts
import {
  DefaultMatCalendarRangeStrategy,
  MatRangeDateSelectionModel,
} from '@angular/material/datepicker';

@Component({
  ...,
  providers: [DefaultMatCalendarRangeStrategy, MatRangeDateSelectionModel],
})
```

## Handling Date Range Selection

Next, let's implement the event handler for when the date range selection changes. This handler will be triggered when a user clicks on a date in the calendar. Here's an example implementation:

```ts
selectedDateRange: DateRange<Date> | undefined;

constructor(
  private readonly selectionModel: MatRangeDateSelectionModel<Date>,
  private readonly selectionStrategy: DefaultMatCalendarRangeStrategy<Date>,
) { }

// Event handler for when the date range selection changes.
rangeChanged(selectedDate: Date) {
  const selection = this.selectionModel.selection,
    newSelection = this.selectionStrategy.selectionFinished(
      selectedDate,
      selection
    );

  this.selectionModel.updateSelection(newSelection, this);
  this.selectedDateRange = new DateRange<Date>(
    newSelection.start,
    newSelection.end
  );
}
```

By updating the selection model and assigning the new date range to selectedDateRange, we can ensure that the selected range is accurately reflected in the UI.

Make sure to update your template as well:

```html
<mat-calendar
  [(selected)]="selectedDateRange"
  (selectedChange)="rangeChanged($event)"
></mat-calendar>
```

That's it! By following the steps outlined above, you should now have a fully functional calendar component capable of handling date ranges.

## Creating Custom Date Range Presets

To enhance the user experience, we can implement custom date range presets. These presets allow users to quickly select commonly used date ranges without manually selecting individual dates. Here's an example configuration for presets:

```ts
presets = [
  {
    label: 'Today',
    range: {
      start: new Date(),
      end: new Date(),
    },
  },
  {
    label: 'Last 7 days',
    range: {
      start: (() => {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return date;
      })(),
      end: new Date(),
    },
  },
  {
    label: 'Last 30 days',
    range: {
      start: (() => {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        return date;
      })(),
      end: new Date(),
    },
  },
  ...
]
```

Make sure to render the available presets in your template, allowing users to select them with a single click:

```html
<button
  *ngFor="let preset of presets"
  (click)="selectPreset(preset.range)"
>
  {{ preset.label }}
</button>
```

To handle the preset selection, include a preset handler like the following example. This handler sets the selected date range and ensures that the calendar navigates to the month where the start date lies:

```ts
selectPreset(presetDateRange: { start: Date; end: Date }) {
  this.selectedDateRange = new DateRange<Date>(
    presetDateRange.start,
    presetDateRange.end
  );

  // Jump into month of presetDateRange.start
  if (presetDateRange.start && this.calendar)
    this.calendar._goToDateInView(presetDateRange.start, 'month');
}
```

## Try it Yourself

And there you have it! With the steps outlined in this post, you're well-equipped to use Angular Material's calendar component with date ranges and custom presets. Remember, if you want to see a complete implementation, including the custom range preset buttons, check out the [StackBlitz](https://stackblitz.com/edit/angular-material-calendar-with-date-ranges-and-presets) example provided.