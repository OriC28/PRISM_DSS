from django import template
import pdb

register = template.Library()

@register.filter
def concatenate (string, new_string):
    return str(string) + str(new_string)

@register.filter
def get_data(dictionary, key):
    return dictionary.get(str(key))

@register.filter
def count (queryset, attr_value):
    attr = attr_value.split(",")[0]
    values = attr_value.split(",")[1:]
    result_queryset = queryset  
    for value in values:
        if value.startswith("!"):
            value = value.replace("!", "")
            result_queryset = result_queryset.exclude(**{attr: value})
        else:
            result_queryset = result_queryset.filter(**{attr: value})
    result = result_queryset.count()
    return result

