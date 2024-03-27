pub trait LastName {
    const EN: &'static [&'static str] = &["Aaliyah", "Aaron", "Abagail"];
    const FA: &'static [&'static str] = &["علی", "محمد", "قلی"];
}

pub struct FakeLastName;

impl LastName for FakeLastName {}
