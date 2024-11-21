

export const switchToLocalhost = async (domain: string) => {
  const cookies = await chrome.cookies.getAll({ domain });


  cookies.forEach(cookie => {
    const cookieDetail: chrome.cookies.SetDetails = {
      name: cookie.name,
      domain: 'localhost',
      url: 'http://localhost',
      expirationDate: cookie.expirationDate,
      httpOnly: cookie.httpOnly,
      path: cookie.path,
      sameSite: cookie.sameSite,
      secure: cookie.secure,
      storeId: cookie.storeId,
      value: cookie.value,
    };
    chrome.cookies.set(cookieDetail, cookie => {
      console.log(cookie);
    });
  });
}