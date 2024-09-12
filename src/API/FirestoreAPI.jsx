import { firestore } from "../firebaseConfig";
import {
  addDoc,
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  where,
  setDoc,
  deleteDoc,
  orderBy,
  getDocs,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth } from "../firebaseConfig";
import { getAuth } from "firebase/auth";
import { sendEmailNotification } from "../helpers/sendEmailNotification";
import { toast } from "react-toastify";

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
const getUserResultsRef = (userId) => {
  return collection(firestore, "users", userId, "results");
};

// Funkcja do usuwania wyniku
export const deleteResult = async (userId, resultId) => {
  try {
    // Sprawdzenie, czy resultId jest prawidłowy
    if (!resultId) {
      throw new Error("Invalid result ID");
    }
    // Utworzenie referencji do dokumentu, który chcemy usunąć
    const resultDocRef = doc(getUserResultsRef(userId), resultId);

    // Usunięcie dokumentu z Firestore
    await deleteDoc(resultDocRef);

    console.log("Result deleted successfully");
    return true; // Możesz zwrócić wartość informującą o powodzeniu operacji
  } catch (error) {
    console.error("Error deleting result: ", error);
    return false; // Możesz zwrócić wartość informującą o niepowodzeniu operacji
  }
};

export const saveResults = (userId, data) => {
  const dbRef = getUserResultsRef(userId);
  let object = {
    data: data,
  };
  addDoc(dbRef, object)
    .then((res) => {
      console.log("Document added!");
    })
    .catch((err) => {
      console.log(err);
    });
};

export const postResults = async (
  userId,
  systolicValue,
  diastolicValue,
  pulseValue,
  date,
  time
) => {
  try {
    const user = auth.currentUser;
    const dbRef = getUserResultsRef(userId);
    const currentDateTime = new Date();
    const formattedDate = date || currentDateTime.toISOString().split("T")[0];
    const formattedTime = time || currentDateTime.toLocaleTimeString();

    await addDoc(dbRef, {
      systolicValue,
      diastolicValue,
      pulseValue,
      date: formattedDate,
      time: formattedTime,
    });

    const userSettings = await getUserSettings(userId);
    if (userSettings?.allowEmailNotifications) {
      let shouldSendNotification = 0;

      if (
        userSettings.hypertensiveCrisis &&
        (systolicValue >= 180 || diastolicValue >= 120)
      ) {
        shouldSendNotification = 5;
      } else if (
        userSettings.stage2Hypertension &&
        ((systolicValue >= 160 && systolicValue < 180) ||
          (diastolicValue >= 100 && diastolicValue < 120))
      ) {
        shouldSendNotification = 4;
      } else if (
        userSettings.stage1Hypertension &&
        ((systolicValue >= 140 && systolicValue < 160) ||
          (diastolicValue >= 90 && diastolicValue < 100))
      ) {
        shouldSendNotification = 3;
      } else if (
        userSettings.prehypertension &&
        ((systolicValue >= 120 && systolicValue < 140) ||
          (diastolicValue >= 80 && diastolicValue < 90))
      ) {
        shouldSendNotification = 2;
      } else if (
        userSettings.hypotension &&
        systolicValue < 90 &&
        diastolicValue < 60
      ) {
        shouldSendNotification = 1;
      }

      if (shouldSendNotification > 0) {
        console.log("Email sent - value number: " + shouldSendNotification);
        await sendEmailNotification(
          userId,
          userSettings.supportEmail,
          user.email,
          shouldSendNotification,
          systolicValue,
          diastolicValue,
          pulseValue,
          formattedDate,
          formattedTime
        );
      }
    }

    return true; // Możesz zwrócić coś, co poinformuje, że zapisywanie się powiodło
  } catch (error) {
    console.error("Error saving stats to Firebase: ", error);
    return false; // Możesz zwrócić coś, co poinformuje, że zapisywanie się nie powiodło
  }
};

export const getResults = (userId, setAllResults) => {
  const dbRef = getUserResultsRef(userId);
  const q = query(dbRef, orderBy("date", "desc"), orderBy("time", "desc"));
  onSnapshot(q, (response) => {
    // Przetwarzanie wyników
    const results = response.docs.map((doc) => {
      const data = doc.data();
      const dateTime = `${data.date}T${data.time}:00.000Z`; // Tworzenie pełnego timestampu
      return { ...data, dateTime, id: doc.id }; // Dodawanie timestampu do wyników
    });

    setAllResults(results); // Ustawianie przetworzonych wyników
  });
};

// chatVVVVVVVVVVVVV

const usersCollection = collection(firestore, "users");
//W users
/* export const saveUserData = async (userId, data) => {
  try {
    const userDocRef = doc(usersCollection, userId);
    await setDoc(userDocRef, data);
    console.log("User data saved!");
    return true;
  } catch (error) {
    console.error('Error saving user data to Firestore: ', error);
    return false;
  }
}; */

// Kolekcja 'user_data'
export const saveUserTableEntry = async (userId, entryData) => {
  try {
    // Tworzymy referencję do kolekcji "user_table" dla danego użytkownika
    const userDataTableRef = collection(usersCollection, userId, "Results");

    // Dodajemy nowy dokument, a Firestore automatycznie wygeneruje unikalny identyfikator
    await addDoc(userDataTableRef, entryData);

    console.log("User table entry saved!");
    return true;
  } catch (error) {
    console.error("Error saving user table entry to Firestore: ", error);
    return false;
  }
};

export const getUserData = (userId, setUserData) => {
  const userDocRef = doc(usersCollection, userId);

  onSnapshot(userDocRef, (snapshot) => {
    setUserData(snapshot.data());
  });
};

export const getUserTableData = (userId, setUserTableData) => {
  const userDataTableRef = collection(usersCollection, userId, "user_table");

  onSnapshot(userDataTableRef, (snapshot) => {
    setUserTableData(
      snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
  });
};

export const updateResult = async (userId, resultId, updatedData) => {
  try {
    // Tworzymy referencję do konkretnego dokumentu
    const resultDocRef = doc(firestore, "users", userId, "results", resultId);

    // Zaktualizuj dokument
    await updateDoc(resultDocRef, updatedData);
    console.log("Document updated successfully!");
    return true;
  } catch (error) {
    console.error("Error updating result: ", error);
    return false;
  }
};

export const getResultsWithinRange = async (userId, startDate, endDate) => {
  try {
    const dbRef = getUserResultsRef(userId);
    const q = query(
      dbRef,
      where("date", ">=", startDate.toISOString().split("T")[0]),
      where("date", "<=", endDate.toISOString().split("T")[0]),
      orderBy("date", "desc")
    );

    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return results;
  } catch (error) {
    console.error("Error fetching results within range:", error);
    throw error;
  }
};

//USER

// Funkcja do usuwania całej historii wyników użytkownika
export const deleteResultHistory = async (userId) => {
  try {
    const resultsRef = collection(firestore, "users", userId, "results");
    const querySnapshot = await getDocs(resultsRef);

    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    console.log("History deleted successfully!");
  } catch (error) {
    console.error("Error deleting history: ", error);
    throw error;
  }
};

// Zapisanie dodatkowego emaila użytkownika
export const saveUserData = async (userId, data) => {
  try {
    const userDocRef = doc(firestore, "users", userId);
    await setDoc(userDocRef, data, { merge: true });
    console.log("User data saved!");
    return true;
  } catch (error) {
    console.error("Error saving user data to Firestore: ", error);
    return false;
  }
};

export const getUserSupportEmail = async (userId) => {
  try {
    // Referencja do dokumentu użytkownika
    const userDocRef = doc(firestore, "users", userId);

    // Pobieranie dokumentu użytkownika
    const userDoc = await getDoc(userDocRef);

    // Sprawdzenie czy dokument istnieje
    if (userDoc.exists()) {
      // Pobranie pola supportEmail z dokumentu
      const userData = userDoc.data();
      return userData.supportEmail || "someone@example.com"; // Zwrócenie emaila lub domyślnego wartości
    } else {
      console.error("User document does not exist");
      return "someone@example.com"; // Jeśli dokument nie istnieje, zwracamy domyślny email
    }
  } catch (error) {
    console.error("Error getting support email: ", error);
    return "someone@example.com"; // Jeśli wystąpi błąd, zwracamy domyślny email
  }
};

export const getUserSettings = async (userId) => {
  try {
    const userDocRef = doc(firestore, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data(); // Zwróć wszystkie ustawienia użytkownika
    } else {
      console.error("User document does not exist");
      return null;
    }
  } catch (error) {
    console.error("Error getting user settings: ", error);
    return null;
  }
};
