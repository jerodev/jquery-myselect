# jQuery myselect v0.1

[![Build Status](https://travis-ci.org/jerodev/jquery-myselect.svg?branch=master)](https://travis-ci.org/jerodev/jquery-myselect)

This is yet another jQuery multiselect library. The difference with other libraries 
is that this one was made with customization in mind. I tried to make this library
as small and simple as possible so anyone can create his own multiselect box from
this base.

Of course, this library works fine on its own without any need of customization. If
you want to know how to use it, take a look at the [documentation](https://jerodev.github.io/jquery-myselect/).

![jquery myselect example image](https://github.com/jerodev/jquery-myselect/raw/master/example.png?raw=true)

## Usage

jQuery myselect can be used as any other jQuery plugin. You use jQuery to select a number of elements and call
a the `myselect()` function on this group. If needed, this function will take some arguments. A 
[list of arguments](https://jerodev.github.io/jquery-myselect/#options) can be found in the 
[documentation](https://jerodev.github.io/jquery-myselect/).

```
$("select").myselect({ 
    width: '100%',
    placeholder: 'Countries in Europe'
});
```

## Examples

Examples of this multiselect can be found on [the documentation website](https://jerodev.github.io/jquery-myselect/).

## License

**The MIT License (MIT)**

Copyright (c) 2015 Jeroen Deviaene

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.