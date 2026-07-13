<div class="flex items-baseline justify-between mb-2">
  <h1 class="text-2xl font-light tracking-tight">When in Bologna, on open source</h1>
  <time class="text-sm text-gray-600 ml-4">May 27, 2026</time>
</div>

> *The story of ~~my first open source contribution~~*

I'm reporting from **[PyCon Italy 2026](https://2026.pycon.it/en)**, Bologna, the city of ragù and mortadella, and, as of today, my very first steps toward an open source contribution.

I have always thought open source contributors were kind of **bad ass**. They are the people behind the tools I use every day, quietly fixing and improving things. Every time I `pip install` something and it works, there is a person somewhere who made that happen.

The conference kicked off with an Open Day dedicated to communities. I spent it at the **[Django Off The Med](https://2026.pycon.it/en/event/django-off-the-med)** workshop, which is a sprint session inspired by the [Django On The Med](https://buttondown.com/django-on-the-med) gatherings, brought to the city of Bologna for the conference.

The format is simple: you clone the repo, set up the test suite, and start looking for something to work on in the [bug tracker](https://code.djangoproject.com/query).

## ~~My first open source contribution~~

`Django` and I are not really there yet. I don't use it that much, so jumping straight into contributing to the framework itself felt like a stretch too far for one morning.

What I did instead turned out to be more relevant to me anyway. I set up a project where I got to interact a bit more with **[GeoDjango](https://docs.djangoproject.com/en/6.0/ref/contrib/gis/)**, `Django`'s built-in geospatial extension. (I work with weather data, and spatial queries come with the territory.)

Turns out `GeoDjango` offers quite a lot. For example:

- **Geometry model fields** - `PointField`, `PolygonField`, `MultiPolygonField` which map directly to OGC geometry types in `PostGIS`.
- **Spatial ORM lookups** - you can query with things like `filter(poly__dwithin=(geom, D(km=5)))` directly in the `ORM`, no raw SQL needed.
- **Distance calculations built in** - annotate a queryset with `Distance("point", reference_point)` and get back a `Distance` object you can express in various units: `.km`, `.mi`, `.m`.

One thing I keep turning over: there is a real difference between writing raw `SQL` and query builders, where you have full control over what hits the database, and using an `ORM`. Neither is obviously better, and for spatial data specifically I am curious how the abstractions hold up when queries get complex.

But when in Bologna, do as the Bolognesi do - and apparently that means leaving with something to explore.
