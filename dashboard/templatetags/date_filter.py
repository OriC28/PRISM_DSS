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

@register.filter
def count_onqueryset_filter(dictionary, key_attr_value):
    """ Counts the number of items in a queryset that match the value, the queryset is extracted from the dictionary using the key.
    The argument key_value is a string that contains the key, the attribute in the queryset to be filtered and 
    the value separated by a comma.
    Example: "key, attribute, value"

    Args:
        dictionary (dict): The dictionary containing the queryset.
        key_attr_value (str): The key, attribute and value separated by a comma.
    """
    #key_attr_value is splitted into separated variables
    key = key_attr_value.split(",")[0]
    attribute = key_attr_value.split(",")[1]
    value = key_attr_value.split(",")[2]
    if type(dictionary) is not dict:
        queryset = dictionary
        result = queryset.filter(**{attribute: value}).count()
    else:
        queryset = dictionary.get(str(key))
        result = queryset.filter(**{attribute: value}).count()
    return str(result)
