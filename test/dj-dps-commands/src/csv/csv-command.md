---
title: Csv injection

---

Sets ```csv``` type for script context

For example you can injection:

```js
<?csv
    DATE;HOUR;MINUTE;AVG;MIN;MAX;HH;H;L;LL;MEASURE
    20160101;0;;143.73;;;;;;;Rh/h
    20160101;1;;143.79;;;;;;;Rh/h
    20160101;2;;143.68;;;;;;;Rh/h
?>

json()
set('data')

```

