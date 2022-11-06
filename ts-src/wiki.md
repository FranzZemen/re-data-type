# Data Type Wiki

In the re framework quick start,
the [concept of a data type](https://github.com/FranzZemen/re/blob/main/ts-src/quick-start.md#introducing-data-types)
was introduced.

Data Types provide the re framework with the ability to evaluate its functional parts, for example to compare two
expressions in the right way or to evaluate formulas. The concept of data types at the language level (Javascript) is
insufficient for the re framework because Javascript provides insufficient support especially for things like custom
data types.

The re framework provides for some "standard" or fundamental Data Types that can be useful for simple cases. Others will
be added over time, as well as more complex ones; but it is also likely that re framework users will provide custom data
types over time for their projects.

## Literal Values

All standard data types have a literal value representation. Custom Data Types may optionally have literal value
representations. Literal value ranges may appear to overlap, and this is fine.

For example, the literal value for Text is a double-quoted string. However, one can also define a custom data type that
uses double-quoted strings, for example Morse. The range of values in the quoted string would be infinite for the Text
data type, but constrained for the Morse one.

When data types have overlapping ranges of literal values, the parsers for the textual format need to be ordered in
such a way that the inference engine will make the right choices in the absence of Hints.

## Standard Data Types

The current list of Standard Data Types are below.

<table>
    <tr><th>Data Type</th><th>Description</th><th>Javascript equivalency (if applicable)</th></tr>
    <tr><td>Text</td><td>string representation of data</td><td>string</td></tr>
    <tr><td>Number</td><td>a number without a floating point</td><td>number</td></tr>
    <tr><td>Float</td><td>a floating point number expressed as NN.dd</td><td>number</td></tr>
    <tr><td>Boolean</td><td>boolean value of true or false</td><td>boolean</td></tr>
    <tr><td>Timestamp</td><td>a timestamp including date and time</td><td>moment (moment.js)</td></tr>
    <tr><td>Date</td><td>a date, exclusive of time</td><td>moment (moment.js)</td></tr>
    <tr><td>Time</td><td>a time, exclusive of date</td><td>moment (moment.js)</td></tr>
</table>


### Literal Formats, Text Hinted Formats, Runtime Conversions and Inference Order
This table provides formats for standard Data Type literal values, as well as some additional supportive information.
The Inference Order is the order in which the DataTypeParser will attempt to infer which Data Type it is if it is 
not explicitly provided by context or by a hint during text format parsing, or if it cannot be inferred by the 
literal value itself (for example in the absence of other information "5" would be inferred as a Number).

<table>
<tr>
    <th>Data Type</th>
    <th>Native Format</th>
    <th>With Hints (Text Format)</th>
    <th>Runtime Conversions</th>
    <th>Inference Order</th>
</tr>
<tr>
    <td>Timestamp</td>
    <td>"YYYY-MM-DDTHH:mm:ss" OR "YYYY-MM-DD HH:mm:ss"</td>
    <td>any_number N, no decimals OR string of any_number, no decimals OR moment convertible</td>
    <td>text or number to moment</td>
    <td>1</td>
</tr>
<tr>
    <td>Date</td>   
    <td>"YYYY-MM-DD"</td>
    <td>any_number N, no decimals OR string of any_number, no decimals OR moment convertible</td>
     <td>text or number to moment</td>
    <td>2</td>
</tr>
<tr>
    <td>Time</td>
    <td>"HH:mm:ss"</td>
    <td>any_number N, no decimals OR string of any_number, no decimals OR moment convertible</td>
     <td>string or number to moment</td>
    <td>3</td>  
</tr>
<tr>
    <td>Text</td>
    <td>"any_character"</td>
    <td>n/a</td>
    <td>number to string</td>
    <td>4</td>
    </tr>
<tr>
    <td>Number</td>
    <td>any_number N, no decimals</td>
    <td>quoted version of native</td>
    <td>string to number</td>
    <td>5</td>
    </tr>
<tr>
    <td>Float</td>
    <td>a_floating_point_number NN.dd</td>
    <td>quoted version of native</td>
    <td>string to number</td>
    <td>6</td>
    </tr>
<tr>
    <td>Boolean</td>
    <td>true or false</td>
    <td>quoted version of native OR numeric with 0 for false OR text with "0" for false</td>
    <td>string to boolean or number to boolean</td>
    <td>7</td>
</tr>
</table>

It is possible to alter the inference order, which can be required when new Custom Data Types are added.  In the 
absence of reordering, any Custom Data Types are appended to the inference order (and this is often exactly the 
desired behavior).  In the Morse Data Type example referred to previously, however, one would normally want the Morse 
Data Type to be inferred prior to the Text Data Type.

The inference order is controlled through options, either provided at re framework initialization, provided inline 
in the text format, or programmatically.

=====
The inference order is controlled in the global [Options](Options). Absence of an entry, the Standard Data Types will be
inferred as above.

The allowed format with [Hints](Hints) for the Text Format is an alternative way to express a literal value provided the
data-type hint is supplied.

The runtime conversion is the attempt to convert to a native Javascript type if it is not already in that type.  
This information is not that useful for literal types, but could be useful if, for example, an Attribute Expression with
a Number Data Type pointed to at run time to a property that happens to be a quoted number; it may be beyond the easy
control of the user to change that and this case is fairly frequent. Therefore, the Rules Engine does allow for these
natural conversions to happen upon evaluation.

## Examples

For examples of Standard Data Types in Value Expression literals and other Expressions, see [Expressions](Expression).

## Text Format Parsers

Parsers for literals at the Data Type level are not likely to be that useful to the regular Rules Engine user, but there
may be some \cause for invoking them directly. This section explains how to invoke them, with a more detailed
explanation in the [Contributor's Reference](ContributorDataType). More typically, usage of the Value Expression parser
would be used than these low level parsers.

Each Data Type (including Custom Data Types) has their own parsers that supply the following API:

    parse(remaining: string, forceType: boolean, ec?: LogExecutionContext): [string, any];
    
    where:
        
        remaining: is the text to parse and for a successful parsing the very next text should be the data type 
        literal value

        forceType: is a flag to force an attempt to alternative text formats (as if there were a hint to do so)

        ec: is the optional Execution Context

        returns:  a tuple, the first element being the remaining text after parsing, the second being the parsed value.
        If the parsed value is undefined, that indicates that the text starting at remaining does not contain this 
        data type literal, and the returned remaining text is the same as what was passed in.

The Standard Data Type Parser classes containing the above API method are:

    [DataType]LiteralParser

    where [DataType] can be replaced with the Data Type (Text, Number etc.)

These parsers only parse if they find their own respective values. There is an overall Data Type Parser that will parse
*any* Data Type literal value (including Custom Data Types) if it is in supplied text.

This is the DataTypeInferenceStackParser and its API is:

    parse(remaining: string, scope: Map<string, any>, dataTypeRef: string, execContext?: LogExecutionContext): [string,[any, string]]

This method accepts the text to parse, where here also the literal values should be immediately at the start of the
text, followed by the abstracted [Scope](Scope) (provided by a Map), the inferred context any the optional
[Execution Context](ExecutionContext).

The DataTypeInferenceStackParser attempts to parse the Data Type, either because it is told which one to parse through
the dataTypeRef, or by attempting each registered Data Type Parser in the inference order until one returns a value or
no literal value is found.

In this method, remaining input is the text where the literal value may start, the scope is ignored (see below),
dataTypeRef may be undefined, but if provided forces parsing for that Data Type.

It returns a tuple that contains the remaining text after parsing the value (which is the same as input if no literal
value is found), followed by a sub-tuple which itself contains the parsed value and the inferred (or supplied) Data
Type.

We mentioned the scope parameter is not used; it is an artifact that stems from DataTypeInferenceStackParser inheriting
from the base class InferenceStackParser. In some cases the scope value for implementations is required.  
It could conceivably be useful here in the future.

## Stringifier

As with Data Type Parsers, its not anticipated that users would normally need to invoke the Stringifier to convert Data
Type values to the Text Format - its more likely that they would invoke the Expression stringifiers and even then, that
would be for a purpose more sophisticated that simple Rules Engine usage.

That said the same pattern for Stringifiers exist as for Parsers.

More on this TBD.

## Custom Data Types

Custom Data Types provide a powerful way to represent complex data shapes and compare and operate on that data shape
using conditions, formulas and functions.

A Custom Data Type may be an object shape or even something as simple as a formatted sequence of characters
(similar to Timestamps for instance), such as Morse.

When should Custom Data Types be considered? It's really up to the Rules Engine user, but guidance is provided here that
often it is preferable to simply use things like Attribute Expression to specific object attributes instead of Custom
Data Types, if only not to lose some of the externalization a Rules Engine is used for in the first place.  
However, there may be some very real business logic that isn't necessary to express in a Rules Engine over a shape.

For example, say the data domain is equities; an organization may have definitions on how to consider one equity more
valuable than another. They may not care to expose that to the Rules Engine (and it may be prohibitively complex to do
so), but find it important to make decisions if an equity IS more valuable:

    <ex data-type=Stock>> data.equity1 is more valueable than data.equity2

    where Stock is a custom Data Type and "is more valuable than" is a custom Comparator

There are other ways to achieve a similar convenience, of course. One could create a Function Expression that returned a
relative value, for example and express it hypothetically as:

    @RelativeValue[data.equity1] > @RelativeValue[data.equity2]

Or one could express it as Formula Expressions for example:

    @+[data.equity1.PERatio * data.equity1.sharesOutstanding] > @+[data.equity2.PERatio * data.equity2.sharesOutstanding]

So, before using a Custom Data Type, there are other choices to consider as well.

Finally a Custom Data Types is not really useful without at least one of Custom Comparator or Custom Operators.  
After all, the point of a Rules Engine is to calculate and compare things.

### Creating a Custom Data Type

The following steps are needed to create a Custom Data Type:

1. Creating and registering the implementation, including potentially reconfiguring the inference order
2. Optionally creating and registering a parser if it will be used in the Text Format
3. Optionally creating and registering a stringifier if it will be used in the Text Format

We will create two Custom Data Types, one based on an object shape (Stock), and one based on a series of characters
(Morse). The code is located in:

    Example: /quick-start/data-type/custom/1.2

#### Creating And Registering The Implementation

To create a Custom Data Type, first implement the interface DataTypeI or extend the abstract class DataType. A KEY
requirement is that the DataTypeI shape that you implement does not have instance specific state. The aforementioned
eval method can go get instance specific state at run time, but you have no control how the shape instance itself will
be handle. Therefore, assume stateless.

    interface DataTypeI {
        refName: string
        eval(value: any): any | Promise<any>;
    }

This interface requires two properties.

First a refName, which will be the name of the Custom Data Type and should not conflict with other Data Types. By
Convention, names are capitalized, for example: Text. While spaces are allowed for multi-word, they are discouraged. For
one thing, when using them in data-type hints, you would need to use double quotes; whereas contiguous letters don't
need quotes. Moreover, if desiring to contribute the Custom Data Type to the project as a Standard Data Type, spaces are
not allowed.

We are creating two Custom Data Types, and we'll use the refNames of "Stock" and "Morse".

The Shape of Stock is:

    interface Stock {
        ticker: string;
        previousDayClosingPrice: number;
        currentPrice: number;
        PERatio: number;
    }

The Shape of Morse is a string whose values can be whitespace, short dashes "-" and long dashes "_".

    type Morse: string;

The second property is an evaluation method. Its role is:

1. To ensure that given value maps to the Data Type rules
2. To perform any implicit conversions (such as converting "1" to 1 for a StandardNumberDataType)
3. To perform additive functions that can only be performed on the value at run time

Within the Rules Engine, everything ultimatly resolves to understanding the value of an Expression at Runtime and this
method is at the root of it. For example, an Attribute Expression of Data Type Number points at design time to some
attribute on teh data domain. At run time the rules engine fetches that value and passes it through the Number Data Type
eval method; what results is the value it uses. This is true of all Expressions except potentially the Function
Expression, where the implementor has the option to do otherwise.

If role 1 is not met or there is an issue with role 2 or 3, the eval method should return undefined.

The returned value is the shape of the Data Type or a Promise to it. It could be a Promise as a result of role 3, above.
None of the Standard Data Types return a Promise. The Rules Engine has several areas where a Promise may be generated,
and knows how to convert evaluations from synchronous to asynchronous on the fly.

In the case of Stock, the evaluation will ensure that the passed in value will be a partial of the shape (all the values
except currentPrice). It will implicitly convert any numbers in strings as numbers for previousDayClosingPrice and
PERatio. It will "look up" the current market price (last agreed price), which during trading hours fluctuates from
moment to moment.

In the case of Morse, the evaluation will ensure that it is a string, and that only the allowed characters exist.

The implementor is free to choose any type of logic in meeting roles 1 through 3. In our own custom objects we often
leverage things like fastest-validator, but in this case we'll use simply validation logic. We won't worry much about
whether the ticker symbol exists or not, but that might be something to do if it were a real production implementation.
For Morse, we will leverage regular expressions but we won't worry as to whether the Morse words make any sense.

    class StockDataType implements DataTypeI {
      refName: string = 'Stock';
    
      eval(value: any): Stock | Promise<Stock> {
        if(isStock(value)) {
          if(isInsideTradingHours()) {
            return lookupCurrentPrice(value.ticker)
              .then(price => {
                value.currentPrice = price;
                return value;
              })
          } else {
            value.currentPrice = value.previousDayPrice;
            return value;
          }
        } else {
          return Promise.resolve(undefined);
        }
      }
    }


    class MorseDataType extends DataType {
      constructor() {
        super('Morse');
      }
    
      eval(value:any): Morse {
        if(typeof value === 'string' && /^[\-_ ]*$/.test(value)) {
          return value;
        } else {
          return undefined;
        }
      }
    }

Now that we have the implementations, we need to register them with the Rules Engine so that they can be used.  
There are several ways to achieve that:

- Programmatically
- Through top level Options
- Inline

#### Registering the Custom Data Types Programmatically

To register the Custom Data Types Programmatically, you will need to invoke the DataTypeFactory. For now we'll just
worry about the registration method - you can read more about this factory [here](DataTypeFactory).

The method to invoke is:

    registerDataType(dataType: DataTypeI, ec?: ExecutionContext)

To get "right" instance of the DataTypeFactory, you will need to understand [Scopes](Scope); for now we'll assume
Global (Rules Engine) scope.

Which we'll invoke twice

    const dataTypeFactory = Rules.Engine.getScope().get(ScopeKey.DataTypeFactory);
    registerDataType(new StockDataType());
    registerDataType(new MorseDataType());

#### Registering the Custom Data Types With Options

This is the more common way to register Custom Data Types, as no programming is necessary.

See [Options](Option)

#### Registering the Custom Data Types Inline

If you need to register Custom Data Types inline, you can do so in the Reference or Text Format

See [Hints For Expressions](Expression)
