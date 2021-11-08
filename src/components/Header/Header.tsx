import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import ResultsStore from '../../stores/resultsStore';

import './Header.scss';
interface IProps {
    resultsStore?: ResultsStore;
  }
  interface IState {
    keyword: string;
    typingTimeoutId: any;
  }

@inject('resultsStore')
@observer
class Header extends Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    

    this.state = {
      keyword: '',
      typingTimeoutId: undefined
    };
  }

  render() {
    const { resultsStore } = this.props;
    return (
      <header className="py-8 md:pt-16 md:pb-10">
        <div className="container mx-auto">
            <div className="flex flex-wrap justify-between">
                <svg className="w-48 md:w-64" fill="none" height="48" viewBox="0 0 296 48" width="296" xmlns="http://www.w3.org/2000/svg"><clipPath id="logo"><path d="m0 0h296v48h-296z"/></clipPath><g clipPath="url(#logo)"><path d="m0 0h296v48h-296z" fill="none"/><g fill="#e2231a"><path d="m260.835 47.8385h-7.296l18.461-24.6154 16.703-22.857133h7.297z"/><path d="m288.703 47.8385h7.297l-18.462-24.6154-16.703-22.857133h-7.297z"/><path d="m190.945.365967v47.472533h24.088v-5.7143h-17.67v-41.758233z"/><path d="m158.417 47.8385v-47.472522h24.088v5.714292h-17.67v12.19783l17.582-.055v6.0989l-17.582-.1099v23.6264z"/><path d="m38.8571 23.6627v24.1758h10.9011v-47.472533h-10.0219l-10.6374 16.175833c-1.4066 2.1978-2.5495 4.2198-3.4286 5.978h-.1758c-1.1429-1.9341-2.2857-3.6044-3.6923-5.6264l-11.86813-16.527433h-9.93407v47.472533h10.989v-24.5275c0-1.3187 0-3.1648-.0879-4.7472h.1758c.9671 1.7582 2.1099 3.1648 3.1649 4.5714l8.8791 12.1319h4.8351l7.7363-11.6923c.7912-1.2308 2.7253-3.9561 3.1648-5.011h.0879c-.0879 1.4063-.0879 3.3398-.0879 5.0977z"/><path d="m96.8791 23.6627v24.1758h10.9009v-47.472533h-10.0218l-10.6373 16.175833c-1.4066 2.1978-2.5495 4.2198-3.4286 5.978h-.1758c-1.1429-1.9341-2.2857-3.6044-3.6923-5.6264l-11.8682-16.527433h-9.934v47.472533h10.989v-24.5275c0-1.3187 0-3.1648-.0879-4.7472h.1758c.967 1.7582 2.1099 3.1648 3.1648 4.5714l8.8792 12.1319h4.8351l7.7363-11.6923c.7912-1.2308 2.7253-3.9561 3.1648-5.011h.0879c-.0879 1.4063-.0879 3.3398-.0879 5.0977z"/><path d="m138.11 9.24509h12.571l2.286-8.879123h-39.912v8.879123h13.89v38.59341h11.165z"/><path d="m241.473 23.5342c-3.056 14.7673-9.476 22.7358-15.231 25.8041l-6.756-4.9669c2.044-3.4128 4.629-9.2175 6.553-18.616 3.604-17.1157 11.796-25.477817 18.699-27.11379l5.01 3.71143c-2.7 3.50906-6.038 10.26916-8.275 21.18116z"/></g></g></svg>

                <form className="w-full md:max-w-md relative mt-4 sm:mt-0" onSubmit={e => {
                    e.preventDefault();
                  }}>
                    <input type="search" 
                    className="border-2 px-3 py-2 w-full  border-white text-white font-bold pr-"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const target = e.target || null
                      this.setState({ keyword: target.value })

                      if(this.state.typingTimeoutId) clearTimeout(this.state.typingTimeoutId)
                      
                      this.setState({
                        typingTimeoutId: setTimeout(() => {
                          if (resultsStore) resultsStore.setKeyword(this.state.keyword)
                        }, 500)
                      })
                    }}
                    id="keyword"
                    value={this.state.keyword} 
                    placeholder="Search here..." />

                    <button className="absolute right-0 top-0 p-2 mr-2" arial-label="Search" onClick={(e: React.MouseEvent<HTMLButtonElement>) => { if (resultsStore) resultsStore.setKeyword(this.state.keyword) }}>
                      <svg arial-hidden="true" width="25" height="27" viewBox="0 0 25 27" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect width="4.32532" height="11.9069" transform="matrix(0.656241 -0.754551 0.650927 0.75914 13.6467 17.3515)" fill="#fff"/> <rect width="2.16265" height="6.49465" transform="matrix(0.656237 -0.754555 0.650923 0.759144 13 15.0356)" fill="#fff"/> <circle cx="8.5" cy="8.5" r="7" stroke="#fff" strokeWidth="3"/> </svg>
                    </button>
                </form>
            </div>
        </div>
      </header>
    );
  }
}

export default Header;
