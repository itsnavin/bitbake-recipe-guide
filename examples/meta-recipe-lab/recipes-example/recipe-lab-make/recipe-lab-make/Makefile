CC ?= cc
CPPFLAGS ?=
CFLAGS ?= -O2
LDFLAGS ?=

all: hello

hello: hello.c
	$(CC) $(CPPFLAGS) $(CFLAGS) "$<" $(LDFLAGS) -o "$@"

clean:
	rm -f hello

.PHONY: all clean
