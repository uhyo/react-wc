import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import React, { Fragment } from "react";
import { html, slot } from "..";

describe("html", () => {
  it("no slot", () => {
    const Hello = html`
      <style>
        div {
          font-size: 100px;
        }
      </style>
      <div>Hello</div>
    `;

    render(<Hello />);

    const el = document.getElementsByTagName(Hello.elementName)[0];

    expect(el.shadowRoot?.innerHTML).toMatchSnapshot();
    expect(el.innerHTML).toMatchSnapshot();
  });
  it("one slot", () => {
    const Hello = html`
      <style>
        div {
          font-size: 100px;
        }
      </style>
      <div>${slot()}</div>
    `;

    render(
      <Hello>
        <span>Foobar</span>
      </Hello>
    );

    const el = document.getElementsByTagName(Hello.elementName)[0];

    expect(el.shadowRoot?.innerHTML).toMatchSnapshot();
    expect(el.innerHTML).toMatchSnapshot();
  });
  it("multiple slots", () => {
    const Hello = html`
      <style>
        div {
          font-size: 100px;
        }
      </style>
      <header>${slot("header")}</header>
      <div>${slot()}</div>
      <header>${slot("footer")}</header>
    `;

    render(
      <Hello header={<b>head!</b>} footer="foo!">
        <span>Foobar</span>
      </Hello>
    );

    const el = document.getElementsByTagName(Hello.elementName)[0];

    expect(el.shadowRoot?.innerHTML).toMatchSnapshot();
    expect(el.innerHTML).toMatchSnapshot();
  });

  describe("Named slot values", () => {
    const Hello = html`
      <style>
        div {
          font-size: 100px;
        }
      </style>
      ${slot("child")}
    `;

    it("text", () => {
      render(<Hello child="foobar" />);

      const el = document.getElementsByTagName(Hello.elementName)[0];

      expect(el.innerHTML).toMatchSnapshot();
    });

    it("number", () => {
      render(<Hello child={123} />);

      const el = document.getElementsByTagName(Hello.elementName)[0];

      expect(el.innerHTML).toMatchSnapshot();
    });

    it("boolean", () => {
      render(<Hello child={true} />);

      const el = document.getElementsByTagName(Hello.elementName)[0];

      expect(el.innerHTML).toMatchSnapshot();
    });

    it("null", () => {
      render(<Hello child={null} />);

      const el = document.getElementsByTagName(Hello.elementName)[0];

      expect(el.innerHTML).toMatchSnapshot();
    });

    it("undefined", () => {
      render(<Hello child={undefined} />);

      const el = document.getElementsByTagName(Hello.elementName)[0];

      expect(el.innerHTML).toMatchSnapshot();
    });

    it("intrinsic element", () => {
      render(<Hello child={<span>Hello</span>} />);

      const el = document.getElementsByTagName(Hello.elementName)[0];

      expect(el.innerHTML).toMatchSnapshot();
    });

    it("function component", () => {
      const Fc: React.FC<{ val: string }> = ({ val }) => <b>val is {val}</b>;
      render(<Hello child={<Fc val="abcde" />} />);

      const el = document.getElementsByTagName(Hello.elementName)[0];

      expect(el.innerHTML).toMatchSnapshot();
    });

    it("nested function component", () => {
      const Fc: React.FC<{ val: string }> = ({ val }) => <b>val is {val}</b>;
      const Fc2: React.FC<{ val: string }> = ({ val }) => (
        <Fc val={val + val + val} />
      );
      render(<Hello child={<Fc2 val="abcde" />} />);

      const el = document.getElementsByTagName(Hello.elementName)[0];

      expect(el.innerHTML).toMatchSnapshot();
    });

    it("reused function component", () => {
      const Fc: React.FC<{ val: string }> = ({ val, children }) =>
        children ? <Fragment>{children}</Fragment> : <b>val is {val}</b>;
      const Fc2: React.FC = () => (
        <Fc val={"abc"}>
          <Fc val="def" />
        </Fc>
      );
      render(<Hello child={<Fc2 />} />);

      const el = document.getElementsByTagName(Hello.elementName)[0];

      expect(el.innerHTML).toMatchSnapshot();
    });

    it("class component", () => {
      class Cc extends React.Component<{ val: string }> {
        render() {
          return <b>val is {this.props.val}</b>;
        }
      }
      render(<Hello child={<Cc val="aaaaa" />} />);

      const el = document.getElementsByTagName(Hello.elementName)[0];

      expect(el.innerHTML).toMatchSnapshot();
    });

    it("nested class component", () => {
      class Cc extends React.Component<{ val: string }> {
        render() {
          return <b>val is {this.props.val}</b>;
        }
      }
      class Cc2 extends React.Component<{ val: string }> {
        render() {
          const val = this.props.val;
          return <Cc val={val + val + val} />;
        }
      }
      render(<Hello child={<Cc2 val="aaaaa" />} />);

      const el = document.getElementsByTagName(Hello.elementName)[0];

      expect(el.innerHTML).toMatchSnapshot();
    });
    it("fragment", () => {
      const Fc: React.FC<{ val: string }> = ({ val }) => <b>val is {val}</b>;
      class Cc extends React.Component<{ val: string }> {
        render() {
          return <b>val is {this.props.val}</b>;
        }
      }

      render(
        <Hello
          child={
            <Fragment>
              Hi
              <b>Hello</b>
              <Fc val="foobar" />
              <Cc val="wow" />
            </Fragment>
          }
        />
      );

      const el = document.getElementsByTagName(Hello.elementName)[0];

      expect(el.innerHTML).toMatchSnapshot();
    });
    it("array", () => {
      const Fc: React.FC<{ val: string }> = ({ val }) => <b>val is {val}</b>;
      class Cc extends React.Component<{ val: string }> {
        render() {
          return <b>val is {this.props.val}</b>;
        }
      }

      render(
        <Hello
          child={[
            <b key="a">Hello</b>,
            <Fc key="b" val="foobar" />,
            <Cc key="c" val="wow" />,
          ]}
        />
      );

      const el = document.getElementsByTagName(Hello.elementName)[0];

      expect(el.innerHTML).toMatchSnapshot();
    });
  });
});
